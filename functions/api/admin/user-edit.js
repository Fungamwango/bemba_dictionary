// POST /api/admin/user-edit - edit user name/points
export async function onRequestPost(context) {
  var authErr = await verifyAdmin(context);
  if (authErr) return authErr;

  var { user_id, name, points } = await context.request.json();
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
  try { body = await context.request.clone().json(); } catch(e) {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
  var token = body.token;
  if (!token) return Response.json({ ok: false, error: 'Token required' }, { status: 401 });
  var parts = token.split('.');
  if (parts.length !== 2) return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  var ts = parts[0];
  var sig = parts[1];
  var age = Date.now() - parseInt(ts);
  if (age > 86400000 || age < 0) return Response.json({ ok: false, error: 'Token expired' }, { status: 401 });
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 });
  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var expectedHex = Array.from(new Uint8Array(expected)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  if (sig !== expectedHex) return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  return null;
}
