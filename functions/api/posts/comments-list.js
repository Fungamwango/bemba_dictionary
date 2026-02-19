// POST /api/posts/comments-list - get comments for a post
export async function onRequestPost(context) {
  var { post_id, limit } = await context.request.json();
  if (!post_id) return Response.json({ ok: false, error: 'post_id required' }, { status: 400 });

  limit = Math.min(parseInt(limit) || 10, 50);
  var db = context.env.DB;

  var comments = await db.prepare(`
    SELECT c.id, c.user_id, c.content, c.created_at, u.name as user_name, u.picture as user_picture
    FROM post_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
    LIMIT ?
  `).bind(post_id, limit).all();

  return Response.json({ ok: true, comments: comments.results || [] });
}
