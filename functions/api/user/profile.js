// POST /api/user/profile - get own profile stats
export async function onRequestPost(context) {
  var { device_id } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;

  var user = await db.prepare(
    'SELECT id, name, friend_code, points, total_quizzes, challenges_won, challenges_lost, challenges_drawn, picture, created_at FROM users WHERE device_id = ?'
  ).bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  return Response.json({ ok: true, user: user });
}
