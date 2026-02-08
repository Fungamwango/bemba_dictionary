// POST /api/challenge/reply - send a reply message after completing a challenge
export async function onRequestPost(context) {
  var { device_id, challenge_id, reply_message } = await context.request.json();
  if (!device_id || !challenge_id || !reply_message || typeof reply_message !== 'string' || !reply_message.trim()) {
    return Response.json({ ok: false, error: 'device_id, challenge_id, and reply_message required' }, { status: 400 });
  }
  var msg = reply_message.trim().substring(0, 200);
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var ch = await db.prepare(
    'SELECT * FROM challenges WHERE id = ? AND receiver_id = ? AND status = ?'
  ).bind(challenge_id, me.id, 'completed').first();
  if (!ch) return Response.json({ ok: false, error: 'Challenge not found or not completed' }, { status: 404 });

  // Send reply as a notification to the sender
  await db.prepare(
    'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
  ).bind(ch.sender_id, 'challenge_result', JSON.stringify({
    challenge_id: ch.id,
    from_name: me.name,
    from_id: me.id,
    sender_score: ch.sender_score,
    receiver_score: ch.receiver_score,
    winner: ch.sender_score > ch.receiver_score ? 'sender' : (ch.receiver_score > ch.sender_score ? 'receiver' : 'draw'),
    bonus: ch.sender_points_awarded,
    reply_message: msg
  })).run();

  return Response.json({ ok: true });
}
