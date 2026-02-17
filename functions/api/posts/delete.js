// POST /api/posts/delete - delete own post (-3pts)
export async function onRequestPost(context) {
  var { device_id, post_id } = await context.request.json();
  if (!device_id || !post_id) {
    return Response.json({ ok: false, error: 'device_id and post_id required' }, { status: 400 });
  }

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
    return Response.json({ ok: false, error: 'Not authorized to delete this post' }, { status: 403 });
  }

  await db.prepare('DELETE FROM posts WHERE id = ?').bind(post_id).run();

  // Only deduct points if deleting own post (not admin deleting others' posts)
  if (post.user_id === user.id) {
    await db.prepare('UPDATE users SET points = MAX(0, points - 3) WHERE id = ?').bind(user.id).run();
  }

  return Response.json({ ok: true });
}
