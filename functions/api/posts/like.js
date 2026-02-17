// POST /api/posts/like - toggle like on post
export async function onRequestPost(context) {
  var { device_id, post_id } = await context.request.json();
  if (!device_id || !post_id) {
    return Response.json({ ok: false, error: 'device_id and post_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var user = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Get post author and content
  var post = await db.prepare('SELECT user_id, content FROM posts WHERE id = ?').bind(post_id).first();
  if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 });

  var existing = await db.prepare(
    'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?'
  ).bind(post_id, user.id).first();

  if (existing) {
    await db.prepare('DELETE FROM post_likes WHERE id = ?').bind(existing.id).run();
    return Response.json({ ok: true, action: 'unliked' });
  } else {
    await db.prepare(
      'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)'
    ).bind(post_id, user.id).run();

    // Create notification for post author (only if not liking own post)
    if (post.user_id !== user.id) {
      var postSnippet = post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;
      var notifData = JSON.stringify({ post_id: parseInt(post_id), user_name: user.name, post_snippet: postSnippet });
      await db.prepare(
        'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
      ).bind(post.user_id, 'post_liked', notifData).run();
    }

    return Response.json({ ok: true, action: 'liked' });
  }
}
