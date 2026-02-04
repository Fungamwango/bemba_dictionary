// POST /api/notifications/poll - get notifications + update last_seen (heartbeat)
export async function onRequestPost(context) {
  var { device_id } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Update last_seen (heartbeat)
  await db.prepare('UPDATE users SET last_seen = datetime(?) WHERE id = ?').bind('now', me.id).run();

  // Get recent notifications
  var notifs = await db.prepare(
    'SELECT id, type, data, read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(me.id).all();

  // Count unread
  var unread = await db.prepare(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'
  ).bind(me.id).first();

  return Response.json({
    ok: true,
    notifications: notifs.results,
    unread_count: unread ? unread.count : 0
  });
}
