// POST /api/messages/conversations - get list of conversations
export async function onRequestPost(context) {
  var { device_id } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Get conversations (users we've messaged with)
  var conversations = await db.prepare(`
    SELECT DISTINCT
      CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END as other_user_id,
      u.name, u.picture,
      (SELECT content FROM messages WHERE
        (sender_id = ? AND receiver_id = other_user_id) OR
        (sender_id = other_user_id AND receiver_id = ?)
       ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM messages WHERE
        (sender_id = ? AND receiver_id = other_user_id) OR
        (sender_id = other_user_id AND receiver_id = ?)
       ORDER BY created_at DESC LIMIT 1) as last_message_time,
      (SELECT COUNT(*) FROM messages WHERE
        sender_id = other_user_id AND receiver_id = ? AND read = 0) as unread_count
    FROM messages m
    JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY last_message_time DESC
  `).bind(user.id, user.id, user.id, user.id, user.id, user.id, user.id, user.id, user.id).all();

  return Response.json({ ok: true, conversations: conversations.results || [] });
}
