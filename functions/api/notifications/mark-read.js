// POST /api/notifications/mark-read - mark notifications as read
export async function onRequestPost(context) {
  var { device_id, notification_ids } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  if (notification_ids === 'all') {
    await db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0').bind(me.id).run();
  } else if (Array.isArray(notification_ids) && notification_ids.length > 0) {
    var placeholders = notification_ids.map(function() { return '?'; }).join(',');
    await db.prepare(
      'UPDATE notifications SET read = 1 WHERE user_id = ? AND id IN (' + placeholders + ')'
    ).bind(me.id, ...notification_ids).run();
  }

  return Response.json({ ok: true });
}
