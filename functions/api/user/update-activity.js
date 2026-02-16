// POST /api/user/update-activity - update user activity status
export async function onRequestPost(context) {
  var { device_id, status } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  if (status === 'offline') {
    // Set last_seen to 10 minutes ago so user appears offline immediately
    var oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    await db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(oldTimestamp, user.id).run();
  } else {
    // Update to current time (online)
    var nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(nowUtc, user.id).run();
  }

  return Response.json({ ok: true });
}
