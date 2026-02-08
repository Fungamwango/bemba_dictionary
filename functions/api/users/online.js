// POST /api/users/online - get online users (last seen within 3 minutes)
export async function onRequestPost(context) {
  var { device_id, query, offset } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }
  var db = context.env.DB;

  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) {
    return Response.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  var cutoff = new Date(Date.now() - 3 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
  var off = parseInt(offset) || 0;
  var limit = 20;

  var sql, params;
  if (query && query.trim().length > 0) {
    var q = '%' + query.trim() + '%';
    sql = "SELECT id, name, friend_code, points, picture, last_seen FROM users WHERE id != ? AND last_seen > ? AND (name LIKE ? OR friend_code LIKE ?) ORDER BY last_seen DESC LIMIT ? OFFSET ?";
    params = [me.id, cutoff, q, q, limit + 1, off];
  } else {
    sql = "SELECT id, name, friend_code, points, picture, last_seen FROM users WHERE id != ? AND last_seen > ? ORDER BY last_seen DESC LIMIT ? OFFSET ?";
    params = [me.id, cutoff, limit + 1, off];
  }

  var stmt = db.prepare(sql);
  var result = await stmt.bind(...params).all();
  var users = result.results || [];
  var hasMore = users.length > limit;
  if (hasMore) users = users.slice(0, limit);

  return Response.json({ ok: true, users: users, has_more: hasMore });
}
