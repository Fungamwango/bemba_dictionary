// POST /api/challenge/detail - get challenge detail with questions
export async function onRequestPost(context) {
  var { device_id, challenge_id } = await context.request.json();
  if (!device_id || !challenge_id) {
    return Response.json({ ok: false, error: 'device_id and challenge_id required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var ch = await db.prepare(
    'SELECT c.*, u1.name as sender_name, u2.name as receiver_name FROM challenges c JOIN users u1 ON c.sender_id = u1.id JOIN users u2 ON c.receiver_id = u2.id WHERE c.id = ? AND (c.sender_id = ? OR c.receiver_id = ?)'
  ).bind(challenge_id, me.id, me.id).first();

  if (!ch) return Response.json({ ok: false, error: 'Challenge not found' }, { status: 404 });

  var isSender = ch.sender_id === me.id;
  return Response.json({
    ok: true,
    challenge: {
      id: ch.id,
      questions: ch.questions,
      sender_score: ch.sender_score,
      receiver_score: ch.receiver_score,
      status: ch.status,
      is_sender: isSender,
      opponent_name: isSender ? ch.receiver_name : ch.sender_name,
      opponent_id: isSender ? ch.receiver_id : ch.sender_id,
      sender_points_awarded: ch.sender_points_awarded,
      receiver_points_awarded: ch.receiver_points_awarded,
      created_at: ch.created_at
    }
  });
}
