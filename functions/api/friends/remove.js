// POST /api/friends/remove - remove a friend
export async function onRequestPost(context) {
  var { device_id, friend_user_id } = await context.request.json();
  if (!device_id || !friend_user_id) {
    return Response.json({ ok: false, error: 'device_id and friend_user_id required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Delete friendship in either direction
  await db.prepare(
    'DELETE FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)'
  ).bind(me.id, friend_user_id, friend_user_id, me.id).run();

  return Response.json({ ok: true });
}
