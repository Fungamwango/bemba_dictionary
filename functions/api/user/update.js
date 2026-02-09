// POST /api/user/update - update display name
export async function onRequestPost(context) {
  var { device_id, name } = await context.request.json();
  if (!device_id || !name) {
    return Response.json({ ok: false, error: 'device_id and name required' }, { status: 400 });
  }
  name = name.trim().substring(0, 50);
  if (name.length < 3) {
    return Response.json({ ok: false, error: 'Name must be at least 3 characters' }, { status: 400 });
  }
  var db = context.env.DB;

  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  await db.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, user.id).run();
  return Response.json({ ok: true });
}
