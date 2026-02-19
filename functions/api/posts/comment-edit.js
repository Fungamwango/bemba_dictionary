// POST /api/posts/comment-edit - edit own comment (or any if admin)
export async function onRequestPost(context) {
  var { device_id, comment_id, content } = await context.request.json();
  if (!device_id || !comment_id || !content) {
    return Response.json({ ok: false, error: 'device_id, comment_id and content required' }, { status: 400 });
  }

  content = content.trim();
  if (content.length < 1) {
    return Response.json({ ok: false, error: 'Comment cannot be empty' }, { status: 400 });
  }
  if (content.length > 300) content = content.substring(0, 300);

  var db = context.env.DB;
  var user = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var isAdmin = user.name.toLowerCase() === 'bemdic';

  var comment = await db.prepare('SELECT id, user_id FROM post_comments WHERE id = ?').bind(comment_id).first();
  if (!comment) return Response.json({ ok: false, error: 'Comment not found' }, { status: 404 });

  if (comment.user_id !== user.id && !isAdmin) {
    return Response.json({ ok: false, error: 'Not authorized to edit this comment' }, { status: 403 });
  }

  await db.prepare('UPDATE post_comments SET content = ? WHERE id = ?').bind(content, comment_id).run();

  return Response.json({ ok: true, content: content });
}
