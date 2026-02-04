// POST /api/friends/request - send friend request
export async function onRequestPost(context) {
  var { device_id, target_user_id } = await context.request.json();
  if (!device_id || !target_user_id) {
    return Response.json({ ok: false, error: 'device_id and target_user_id required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });
  if (me.id === target_user_id) {
    return Response.json({ ok: false, error: 'Cannot add yourself' }, { status: 400 });
  }

  var target = await db.prepare('SELECT id, name FROM users WHERE id = ?').bind(target_user_id).first();
  if (!target) return Response.json({ ok: false, error: 'Target user not found' }, { status: 404 });

  // Check if reverse request exists (they already sent one to us)
  var reverse = await db.prepare(
    'SELECT id, status FROM friends WHERE requester_id = ? AND addressee_id = ?'
  ).bind(target_user_id, me.id).first();

  if (reverse && reverse.status === 'accepted') {
    return Response.json({ ok: false, error: 'Already friends' }, { status: 400 });
  }

  // Check if we already sent a request
  var existing = await db.prepare(
    'SELECT id, status FROM friends WHERE requester_id = ? AND addressee_id = ?'
  ).bind(me.id, target_user_id).first();

  if (existing) {
    if (existing.status === 'accepted') return Response.json({ ok: false, error: 'Already friends' }, { status: 400 });
    if (existing.status === 'pending') return Response.json({ ok: false, error: 'Request already sent' }, { status: 400 });
  }

  // If reverse request is pending, auto-accept both
  if (reverse && reverse.status === 'pending') {
    await db.prepare('UPDATE friends SET status = ? WHERE id = ?').bind('accepted', reverse.id).run();
    // Create notification for the other user
    await db.prepare(
      'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
    ).bind(target_user_id, 'friend_accepted', JSON.stringify({ from_name: me.name, from_id: me.id })).run();
    return Response.json({ ok: true, auto_accepted: true });
  }

  // Create new friend request
  await db.prepare(
    'INSERT INTO friends (requester_id, addressee_id) VALUES (?, ?)'
  ).bind(me.id, target_user_id).run();

  // Create notification for target
  await db.prepare(
    'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
  ).bind(target_user_id, 'friend_request', JSON.stringify({ from_name: me.name, from_id: me.id })).run();

  return Response.json({ ok: true });
}
