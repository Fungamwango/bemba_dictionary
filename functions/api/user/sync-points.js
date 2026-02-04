// POST /api/user/sync-points - sync local points to server (takes MAX)
export async function onRequestPost(context) {
  var { device_id, local_points } = await context.request.json();
  if (!device_id || local_points === undefined) {
    return Response.json({ ok: false, error: 'device_id and local_points required' }, { status: 400 });
  }
  var db = context.env.DB;
  var user = await db.prepare('SELECT id, points FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var serverPoints = Math.max(user.points, parseInt(local_points) || 0);
  await db.prepare('UPDATE users SET points = ? WHERE id = ?').bind(serverPoints, user.id).run();
  return Response.json({ ok: true, server_points: serverPoints });
}
