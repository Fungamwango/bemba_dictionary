// POST /api/admin/users - list users with pagination
export async function onRequestPost(context) {
  var authErr = await verifyAdmin(context);
  if (authErr) return authErr;

  var { offset, search } = await context.request.json();
  var db = context.env.DB;
  var off = parseInt(offset) || 0;
  var limit = 30;

  var query, binds;
  if (search && search.trim()) {
    var s = '%' + search.trim() + '%';
    query = 'SELECT id, name, friend_code, points, total_quizzes, challenges_won, challenges_lost, challenges_drawn, last_seen, created_at FROM users WHERE name LIKE ? OR friend_code LIKE ? ORDER BY points DESC LIMIT ? OFFSET ?';
    binds = [s, s, limit + 1, off];
  } else {
    query = 'SELECT id, name, friend_code, points, total_quizzes, challenges_won, challenges_lost, challenges_drawn, last_seen, created_at FROM users ORDER BY points DESC LIMIT ? OFFSET ?';
    binds = [limit + 1, off];
  }

  var result = await db.prepare(query).bind(...binds).all();
  var users = result.results || [];
  var hasMore = users.length > limit;
  if (hasMore) users = users.slice(0, limit);

  // Total user count
  var total = await db.prepare('SELECT COUNT(*) as count FROM users').first();

  return Response.json({ ok: true, users: users, has_more: hasMore, total: total ? total.count : 0 });
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

  // Check token age (24 hours)
  var age = Date.now() - parseInt(ts);
  if (age > 86400000 || age < 0) return Response.json({ ok: false, error: 'Token expired' }, { status: 401 });

  // Verify HMAC
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 });

  var key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(ADMIN_PASSWORD),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  var expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var expectedHex = Array.from(new Uint8Array(expected)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');

  if (sig !== expectedHex) return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  return null;
}
