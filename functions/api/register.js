// POST /api/register - register new user or return existing
function generateFriendCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function onRequestPost(context) {
  var { device_id, name } = await context.request.json();
  if (!device_id || !name) {
    return Response.json({ ok: false, error: 'device_id and name required' }, { status: 400 });
  }
  name = name.trim().substring(0, 50);
  var db = context.env.DB;

  // Check if user already exists
  var existing = await db.prepare('SELECT * FROM users WHERE device_id = ?').bind(device_id).first();
  if (existing) {
    return Response.json({ ok: true, user: existing });
  }

  // Generate unique friend code (retry on collision)
  var friend_code;
  for (var i = 0; i < 10; i++) {
    friend_code = generateFriendCode();
    var dup = await db.prepare('SELECT id FROM users WHERE friend_code = ?').bind(friend_code).first();
    if (!dup) break;
  }

  var user = await db.prepare(
    'INSERT INTO users (device_id, name, friend_code) VALUES (?, ?, ?) RETURNING *'
  ).bind(device_id, name, friend_code).first();

  return Response.json({ ok: true, user: user }, { status: 201 });
}
