// POST /api/posts/edit - edit own post or any post if admin
export async function onRequestPost(context) {
  var { device_id, post_id, content } = await context.request.json();
  if (!device_id || !post_id || !content) {
    return Response.json({ ok: false, error: 'device_id, post_id and content required' }, { status: 400 });
  }

  content = content.trim();
  if (content.length < 5) {
    return Response.json({ ok: false, error: 'Post too short (min 5 characters)' }, { status: 400 });
  }
  if (content.length > 500) content = content.substring(0, 500);

  var db = context.env.DB;
  var user = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Check if admin (BemDic user)
  var isAdmin = user.name.toLowerCase() === 'bemdic';

  // Get the post
  var post = await db.prepare('SELECT id, user_id FROM posts WHERE id = ?').bind(post_id).first();
  if (!post) return Response.json({ ok: false, error: 'Post not found' }, { status: 404 });

  // Check ownership or admin
  if (post.user_id !== user.id && !isAdmin) {
    return Response.json({ ok: false, error: 'Not authorized to edit this post' }, { status: 403 });
  }

  // Update the post
  await db.prepare('UPDATE posts SET content = ? WHERE id = ?').bind(content, post_id).run();

  return Response.json({ ok: true });
}
