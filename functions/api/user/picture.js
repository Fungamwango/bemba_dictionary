// POST /api/user/picture - upload profile picture (base64 WebP, max 64KB)
export async function onRequestPost(context) {
  var { device_id, picture } = await context.request.json();
  if (!device_id || !picture) {
    return Response.json({ ok: false, error: 'device_id and picture required' }, { status: 400 });
  }
  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Validate size: base64 string of 64KB image is ~87KB text, allow up to 90KB
  if (picture.length > 90000) {
    return Response.json({ ok: false, error: 'Picture too large. Max 64KB.' }, { status: 400 });
  }

  await db.prepare('UPDATE users SET picture = ? WHERE id = ?').bind(picture, user.id).run();
  return Response.json({ ok: true });
}
