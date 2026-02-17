// POST /api/admin/user-edit - edit user name/points
export async function onRequestPost(context) {
  var result = await verifyAdmin(context);
  if (result.error) return result.error;
  var body = result.body;

  var user_id = body.user_id;
  var name = body.name;
  var points = body.points;
  if (!user_id) return Response.json({ ok: false, error: 'user_id required' }, { status: 400 });

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE id = ?').bind(user_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var updates = [];
  var binds = [];
  if (name !== undefined && name !== null) {
    name = String(name).trim().substring(0, 50);
    if (name.length < 1) return Response.json({ ok: false, error: 'Name too short' }, { status: 400 });
    updates.push('name = ?');
    binds.push(name);
  }
  if (points !== undefined && points !== null) {
    updates.push('points = ?');
    binds.push(parseInt(points) || 0);
  }
  if (!updates.length) return Response.json({ ok: false, error: 'Nothing to update' }, { status: 400 });

  binds.push(user_id);
  await db.prepare('UPDATE users SET ' + updates.join(', ') + ' WHERE id = ?').bind(...binds).run();

  return Response.json({ ok: true });
}

async function verifyAdmin(context) {
  var body;
  try { body = await context.request.json(); } catch(e) {
    return { error: Response.json({ ok: false, error: 'Invalid request' }, { status: 400 }) };
  }
  var token = body.token;
  if (!token) return { error: Response.json({ ok: false, error: 'Token required' }, { status: 401 }) };
  var parts = token.split('.');
  if (parts.length !== 2) return { error: Response.json({ ok: false, error: 'Invalid token' }, { status: 401 }) };
  var ts = parts[0];
  var sig = parts[1];
  var age = Date.now() - parseInt(ts);
  if (age > 86400000 || age < 0) return { error: Response.json({ ok: false, error: 'Token expired' }, { status: 401 }) };
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return { error: Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 }) };
  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var expectedHex = Array.from(new Uint8Array(expected)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  if (sig !== expectedHex) return { error: Response.json({ ok: false, error: 'Invalid token' }, { status: 401 }) };
  return { body: body };
}
