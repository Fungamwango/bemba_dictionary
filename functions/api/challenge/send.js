// POST /api/challenge/send - create and send a challenge
export async function onRequestPost(context) {
  var { device_id, receiver_id, sender_score, questions } = await context.request.json();
  if (!device_id || !receiver_id || sender_score === undefined || !questions) {
    return Response.json({ ok: false, error: 'device_id, receiver_id, sender_score, and questions required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var receiver = await db.prepare('SELECT id, name FROM users WHERE id = ?').bind(receiver_id).first();
  if (!receiver) return Response.json({ ok: false, error: 'Receiver not found' }, { status: 404 });

  // Store questions as string if not already
  var questionsStr = typeof questions === 'string' ? questions : JSON.stringify(questions);

  var challenge = await db.prepare(
    'INSERT INTO challenges (sender_id, receiver_id, sender_score, questions) VALUES (?, ?, ?, ?) RETURNING *'
  ).bind(me.id, receiver_id, sender_score, questionsStr).first();

  // Update sender's total_quizzes
  await db.prepare('UPDATE users SET total_quizzes = total_quizzes + 1 WHERE id = ?').bind(me.id).run();

  // Create notification for receiver
  await db.prepare(
    'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
  ).bind(receiver_id, 'challenge_received', JSON.stringify({
    challenge_id: challenge.id,
    from_name: me.name,
    from_id: me.id,
    sender_score: sender_score
  })).run();

  return Response.json({ ok: true, challenge_id: challenge.id });
}
