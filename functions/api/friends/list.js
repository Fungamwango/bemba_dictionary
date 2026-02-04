// POST /api/friends/list - get friends list + pending incoming requests
export async function onRequestPost(context) {
  var { device_id } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Accepted friends (I requested or they requested)
  var friends = await db.prepare(`
    SELECT u.id as user_id, u.name, u.friend_code, u.points, u.last_seen, u.picture, f.id as request_id, 'accepted' as status
    FROM friends f
    JOIN users u ON (CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END) = u.id
    WHERE (f.requester_id = ? OR f.addressee_id = ?) AND f.status = 'accepted'
    ORDER BY (CASE WHEN u.last_seen > datetime('now', '-1 minute') THEN 0 ELSE 1 END) ASC, u.name ASC
  `).bind(me.id, me.id, me.id).all();

  // Pending incoming requests
  var requests = await db.prepare(`
    SELECT u.id as user_id, u.name, u.friend_code, u.points, u.picture, f.id as request_id, 'pending' as status
    FROM friends f
    JOIN users u ON f.requester_id = u.id
    WHERE f.addressee_id = ? AND f.status = 'pending'
    ORDER BY f.created_at DESC
  `).bind(me.id).all();

  return Response.json({ ok: true, friends: friends.results, requests: requests.results });
}
