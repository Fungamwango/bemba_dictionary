// POST /api/messages/send - send a message to a user
export async function onRequestPost(context) {
  var { device_id, receiver_id, content } = await context.request.json();
  if (!device_id || !receiver_id || !content) {
    return Response.json({ ok: false, error: 'Required fields missing' }, { status: 400 });
  }

  content = content.trim();
  if (content.length < 1) {
    return Response.json({ ok: false, error: 'Message cannot be empty' }, { status: 400 });
  }
  if (content.length > 500) content = content.substring(0, 500);

  var db = context.env.DB;
  var sender = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!sender) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var receiver = await db.prepare('SELECT id, name, picture FROM users WHERE id = ?').bind(receiver_id).first();
  if (!receiver) return Response.json({ ok: false, error: 'Receiver not found' }, { status: 404 });

  // Insert message
  var message = await db.prepare(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?) RETURNING *'
  ).bind(sender.id, receiver_id, content).first();

  // Create notification for receiver
  var messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
  var notifData = JSON.stringify({
    message_id: message.id,
    sender_id: sender.id,
    sender_name: sender.name,
    message_preview: messagePreview
  });
  await db.prepare(
    'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
  ).bind(receiver_id, 'message_received', notifData).run();

  return Response.json({ ok: true, message: message });
}
