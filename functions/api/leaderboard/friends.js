// POST /api/leaderboard/friends - friends leaderboard (self + friends sorted by points)
export async function onRequestPost(context) {
  var { device_id } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id, name, friend_code, points FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Get all accepted friends
  var friends = await db.prepare(`
    SELECT u.name, u.friend_code, u.points
    FROM friends f
    JOIN users u ON (CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END) = u.id
    WHERE (f.requester_id = ? OR f.addressee_id = ?) AND f.status = 'accepted'
  `).bind(me.id, me.id, me.id).all();

  // Combine self + friends, sort by points
  var all = [{ name: me.name, friend_code: me.friend_code, points: me.points }];
  all = all.concat(friends.results);
  all.sort(function(a, b) { return b.points - a.points; });

  return Response.json({ ok: true, leaders: all, my_code: me.friend_code });
}
