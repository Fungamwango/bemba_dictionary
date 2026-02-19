// POST /api/posts/comment-delete - delete own comment (or any if admin)
export async function onRequestPost(context) {
  var { device_id, comment_id } = await context.request.json();
  if (!device_id || !comment_id) {
    return Response.json({ ok: false, error: 'device_id and comment_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var user = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var isAdmin = user.name.toLowerCase() === 'bemdic';

  var comment = await db.prepare('SELECT id, user_id FROM post_comments WHERE id = ?').bind(comment_id).first();
  if (!comment) return Response.json({ ok: false, error: 'Comment not found' }, { status: 404 });

  if (comment.user_id !== user.id && !isAdmin) {
    return Response.json({ ok: false, error: 'Not authorized to delete this comment' }, { status: 403 });
  }

  await db.prepare('DELETE FROM post_comments WHERE id = ?').bind(comment_id).run();

  return Response.json({ ok: true });
}
