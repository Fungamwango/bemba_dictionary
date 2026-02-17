// POST /api/admin/posts - list all posts with pagination (admin only)
export async function onRequestPost(context) {
  var result = await verifyAdmin(context);
  if (result.error) return result.error;
  var body = result.body;

  var offset = body.offset;
  var limit = Math.min(parseInt(body.limit) || 20, 50);
  var off = parseInt(offset) || 0;

  var db = context.env.DB;

  // Get all posts ordered by creation date (newest first)
  var posts = await db.prepare(`
    SELECT
      p.id, p.content, p.created_at,
      u.id as user_id, u.name as user_name,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit + 1, off).all();

  var results = posts.results || [];
  var hasMore = results.length > limit;
  if (hasMore) results = results.slice(0, limit);

  return Response.json({ ok: true, posts: results, has_more: hasMore });
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
