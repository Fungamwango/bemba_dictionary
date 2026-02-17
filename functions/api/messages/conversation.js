// POST /api/messages/conversation - get messages with a specific user
export async function onRequestPost(context) {
  var { device_id, other_user_id, limit, offset } = await context.request.json();
  if (!device_id || !other_user_id) {
    return Response.json({ ok: false, error: 'device_id and other_user_id required' }, { status: 400 });
  }

  limit = Math.min(parseInt(limit) || 50, 100);
  offset = parseInt(offset) || 0;

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Get messages between the two users
  var messages = await db.prepare(`
    SELECT m.*, u.name as sender_name, u.picture as sender_picture
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE
      (m.sender_id = ? AND m.receiver_id = ?) OR
      (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(user.id, other_user_id, other_user_id, user.id, limit, offset).all();

  // Mark received messages as read
  await db.prepare(
    'UPDATE messages SET read = 1 WHERE sender_id = ? AND receiver_id = ? AND read = 0'
  ).bind(other_user_id, user.id).run();

  return Response.json({
    ok: true,
    messages: (messages.results || []).reverse() // Reverse to show oldest first
  });
}
