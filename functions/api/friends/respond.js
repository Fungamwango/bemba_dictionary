// POST /api/friends/respond - accept or reject friend request
export async function onRequestPost(context) {
  var { device_id, request_id, action } = await context.request.json();
  if (!device_id || !request_id || !action) {
    return Response.json({ ok: false, error: 'device_id, request_id, and action required' }, { status: 400 });
  }
  if (action !== 'accept' && action !== 'reject') {
    return Response.json({ ok: false, error: 'action must be accept or reject' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  var req = await db.prepare(
    'SELECT id, requester_id, addressee_id, status FROM friends WHERE id = ? AND addressee_id = ?'
  ).bind(request_id, me.id).first();

  if (!req) return Response.json({ ok: false, error: 'Request not found' }, { status: 404 });
  if (req.status !== 'pending') return Response.json({ ok: false, error: 'Request already handled' }, { status: 400 });

  await db.prepare('UPDATE friends SET status = ? WHERE id = ?').bind(action === 'accept' ? 'accepted' : 'rejected', req.id).run();

  if (action === 'accept') {
    await db.prepare(
      'INSERT INTO notifications (user_id, type, data) VALUES (?, ?, ?)'
    ).bind(req.requester_id, 'friend_accepted', JSON.stringify({ from_name: me.name, from_id: me.id })).run();
  }

  return Response.json({ ok: true });
}
