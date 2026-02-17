// POST /api/user/view - view another user's profile by user_id
export async function onRequestPost(context) {
  var { device_id, user_id } = await context.request.json();
  if (!device_id || !user_id) {
    return Response.json({ ok: false, error: 'device_id and user_id required' }, { status: 400 });
  }
  var db = context.env.DB;

  // Verify requester exists
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var user = await db.prepare(
    'SELECT id, name, friend_code, points, total_quizzes, challenges_won, challenges_lost, challenges_drawn, picture, created_at, last_seen FROM users WHERE id = ?'
  ).bind(user_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var rankRow = await db.prepare(
    'SELECT COUNT(*) + 1 AS rank FROM users WHERE points > ?'
  ).bind(user.points).first();
  user.rank = rankRow ? rankRow.rank : 0;

  return Response.json({ ok: true, user: user });
}
