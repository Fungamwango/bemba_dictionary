// POST /api/posts/list - list posts (random but recent-first)
export async function onRequestPost(context) {
  var { device_id, limit, offset, seed } = await context.request.json();
  limit = Math.min(parseInt(limit) || 20, 50);
  offset = parseInt(offset) || 0;
  seed = parseInt(seed) || 1;

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var posts = await db.prepare(`
    SELECT
      p.id, p.content, p.created_at,
      u.id as user_id, u.name as user_name, u.picture as user_picture,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count,
      (SELECT COUNT(*) > 0 FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY
      CASE WHEN datetime(p.created_at) > datetime('now', '-24 hours') THEN 0 ELSE 1 END ASC,
      CASE WHEN datetime(p.created_at) > datetime('now', '-24 hours') THEN p.created_at ELSE '' END DESC,
      (p.id * ?) % 2147483647
    LIMIT ? OFFSET ?
  `).bind(user.id, seed, limit, offset).all();

  return Response.json({ ok: true, posts: posts.results || [] });
}
