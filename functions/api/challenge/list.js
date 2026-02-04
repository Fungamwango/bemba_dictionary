// POST /api/challenge/list - list challenges
export async function onRequestPost(context) {
  var { device_id, status } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var query, params;
  if (status && status !== 'all') {
    query = `
      SELECT c.id, c.sender_score, c.receiver_score, c.status, c.created_at, c.completed_at,
        c.sender_points_awarded, c.receiver_points_awarded,
        CASE WHEN c.sender_id = ? THEN 1 ELSE 0 END as is_sender,
        CASE WHEN c.sender_id = ? THEN u2.name ELSE u1.name END as opponent_name,
        CASE WHEN c.sender_id = ? THEN u2.id ELSE u1.id END as opponent_id
      FROM challenges c
      JOIN users u1 ON c.sender_id = u1.id
      JOIN users u2 ON c.receiver_id = u2.id
      WHERE (c.sender_id = ? OR c.receiver_id = ?) AND c.status = ?
      ORDER BY c.created_at DESC LIMIT 50
    `;
    params = [me.id, me.id, me.id, me.id, me.id, status];
  } else {
    query = `
      SELECT c.id, c.sender_score, c.receiver_score, c.status, c.created_at, c.completed_at,
        c.sender_points_awarded, c.receiver_points_awarded,
        CASE WHEN c.sender_id = ? THEN 1 ELSE 0 END as is_sender,
        CASE WHEN c.sender_id = ? THEN u2.name ELSE u1.name END as opponent_name,
        CASE WHEN c.sender_id = ? THEN u2.id ELSE u1.id END as opponent_id
      FROM challenges c
      JOIN users u1 ON c.sender_id = u1.id
      JOIN users u2 ON c.receiver_id = u2.id
      WHERE c.sender_id = ? OR c.receiver_id = ?
      ORDER BY c.created_at DESC LIMIT 50
    `;
    params = [me.id, me.id, me.id, me.id, me.id];
  }

  var stmt = db.prepare(query);
  var challenges = await stmt.bind(...params).all();
  return Response.json({ ok: true, challenges: challenges.results });
}
