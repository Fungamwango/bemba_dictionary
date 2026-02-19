// POST /api/posts/create - create new post (+1pt)
export async function onRequestPost(context) {
  var { device_id, content } = await context.request.json();
  if (!device_id || !content) {
    return Response.json({ ok: false, error: 'device_id and content required' }, { status: 400 });
  }

  content = content.trim();
  if (content.length < 5) {
    return Response.json({ ok: false, error: 'Post too short (min 5 characters)' }, { status: 400 });
  }
  if (content.length > 500) content = content.substring(0, 500);

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var post = await db.prepare(
    'INSERT INTO posts (user_id, content) VALUES (?, ?) RETURNING *'
  ).bind(user.id, content).first();

  await db.prepare('UPDATE users SET points = points + 1 WHERE id = ?').bind(user.id).run();

  return Response.json({ ok: true, post: post });
}
