// POST /api/posts/user-posts - get posts by a specific user
export async function onRequestPost(context) {
  var { device_id, user_id, limit, offset } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }

  limit = Math.min(parseInt(limit) || 20, 50);
  offset = parseInt(offset) || 0;

  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // If no user_id provided, get posts for the current user
  var targetUserId = user_id ? parseInt(user_id) : me.id;

  var posts = await db.prepare(`
    SELECT
      p.id, p.content, p.created_at,
      u.id as user_id, u.name as user_name, u.picture as user_picture,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count,
      (SELECT COUNT(*) > 0 FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(me.id, targetUserId, limit, offset).all();

  return Response.json({ ok: true, posts: posts.results || [] });
}
