// POST /api/notifications/delete - delete a notification
export async function onRequestPost(context) {
  var { device_id, notification_id } = await context.request.json();
  if (!device_id || !notification_id) {
    return Response.json({ ok: false, error: 'device_id and notification_id required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  await db.prepare(
    'DELETE FROM notifications WHERE id = ? AND user_id = ?'
  ).bind(notification_id, me.id).run();

  return Response.json({ ok: true });
}
