// POST /api/posts/comment - add comment to post
export async function onRequestPost(context) {
  var { device_id, post_id, content } = await context.request.json();
  if (!device_id || !post_id || !content) {
    return Response.json({ ok: false, error: 'Required fields missing' }, { status: 400 });
  }

  content = content.trim();
  if (content.length < 1) {
    return Response.json({ ok: false, error: 'Comment cannot be empty' }, { status: 400 });
  }
  if (content.length > 300) content = content.substring(0, 300);

  var db = context.env.DB;
  var user = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Get post author and content
  var post = await db.prepare('SELECT user_id, content FROM posts WHERE id = ?').bind(post_id).first();
  if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 });

  var comment = await db.prepare(
    'INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?) RETURNING *'
  ).bind(post_id, user.id, content).first();

  // Create notification for post author (only if not commenting on own post)
  if (post.user_id !== user.id) {
    var postSnippet = post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;
    var notifData = JSON.stringify({ post_id: parseInt(post_id), user_name: user.name, post_snippet: postSnippet, comment: content.substring(0, 50) });
    await db.prepare(
      'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
    ).bind(post.user_id, 'post_commented', notifData).run();
  }

  return Response.json({ ok: true, comment: { ...comment, user_name: user.name } });
}
