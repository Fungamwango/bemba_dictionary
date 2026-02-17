// POST /api/admin/postdelete - delete any post (admin only)
export async function onRequestPost(context) {
  var result = await verifyAdmin(context);
  if (result.error) return result.error;
  var body = result.body;

  var post_id = body.post_id;
  if (!post_id) return Response.json({ ok: false, error: 'post_id required' }, { status: 400 });

  var db = context.env.DB;

  // Check if post exists
  var post = await db.prepare('SELECT id FROM posts WHERE id = ?').bind(post_id).first();
  if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 });

  // Delete post and related data
  await db.prepare('DELETE FROM post_comments WHERE post_id = ?').bind(post_id).run();
  await db.prepare('DELETE FROM post_likes WHERE post_id = ?').bind(post_id).run();
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(post_id).run();

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
