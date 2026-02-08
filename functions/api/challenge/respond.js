// POST /api/challenge/respond - submit receiver score and calculate winner
export async function onRequestPost(context) {
  var { device_id, challenge_id, receiver_score } = await context.request.json();
  if (!device_id || !challenge_id || receiver_score === undefined) {
    return Response.json({ ok: false, error: 'device_id, challenge_id, and receiver_score required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var ch = await db.prepare(
    'SELECT * FROM challenges WHERE id = ? AND receiver_id = ?'
  ).bind(challenge_id, me.id).first();
  if (!ch) return Response.json({ ok: false, error: 'Challenge not found' }, { status: 404 });
  if (ch.status !== 'pending') return Response.json({ ok: false, error: 'Challenge already completed' }, { status: 400 });

  // Calculate winner and points
  // Win=10, Loss=0, Draw=5 each (0:0 draw = 0 points)
  var senderBonus = 0, receiverBonus = 0, winner;
  if (ch.sender_score > receiver_score) {
    winner = 'sender';
    senderBonus = 10;
    receiverBonus = 0;
  } else if (receiver_score > ch.sender_score) {
    winner = 'receiver';
    senderBonus = 0;
    receiverBonus = 10;
  } else {
    winner = 'draw';
    if (ch.sender_score === 0 && receiver_score === 0) {
      senderBonus = 0;
      receiverBonus = 0;
    } else {
      senderBonus = 5;
      receiverBonus = 5;
    }
  }

  // Update challenge
  await db.prepare(
    'UPDATE challenges SET receiver_score = ?, status = ?, sender_points_awarded = ?, receiver_points_awarded = ?, completed_at = datetime(?) WHERE id = ?'
  ).bind(receiver_score, 'completed', senderBonus, receiverBonus, 'now', ch.id).run();

  // Update sender stats
  var senderWinCol = winner === 'sender' ? 'challenges_won' : (winner === 'draw' ? 'challenges_drawn' : 'challenges_lost');
  await db.prepare(
    'UPDATE users SET points = points + ?, ' + senderWinCol + ' = ' + senderWinCol + ' + 1 WHERE id = ?'
  ).bind(senderBonus, ch.sender_id).run();

  // Update receiver stats
  var receiverWinCol = winner === 'receiver' ? 'challenges_won' : (winner === 'draw' ? 'challenges_drawn' : 'challenges_lost');
  await db.prepare(
    'UPDATE users SET points = points + ?, total_quizzes = total_quizzes + 1, ' + receiverWinCol + ' = ' + receiverWinCol + ' + 1 WHERE id = ?'
  ).bind(receiverBonus, me.id).run();

  // Get sender name for notification
  var sender = await db.prepare('SELECT name FROM users WHERE id = ?').bind(ch.sender_id).first();

  // Notify sender of result
  await db.prepare(
    'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
  ).bind(ch.sender_id, 'challenge_result', JSON.stringify({
    challenge_id: ch.id,
    from_name: me.name,
    from_id: me.id,
    sender_score: ch.sender_score,
    receiver_score: receiver_score,
    winner: winner,
    bonus: senderBonus
  })).run();

  return Response.json({
    ok: true,
    result: {
      sender_name: sender ? sender.name : 'Unknown',
      sender_score: ch.sender_score,
      receiver_score: receiver_score,
      winner: winner,
      sender_bonus: senderBonus,
      receiver_bonus: receiverBonus
    }
  });
}
