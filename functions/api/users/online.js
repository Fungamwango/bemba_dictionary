// POST /api/users/online - get all online users (last seen within 5 minutes)
export async function onRequestPost(context) {
  var { device_id, query } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }
  var db = context.env.DB;

  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) {
    return Response.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  // Calculate cutoff time (3 minutes ago) in JS for consistency
  var cutoff = new Date(Date.now() - 3 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);

  var sql, params;
  if (query && query.trim().length > 0) {
    var q = '%' + query.trim() + '%';
    sql = "SELECT id, name, friend_code, points, picture, last_seen FROM users WHERE id != ? AND last_seen > ? AND (name LIKE ? OR friend_code LIKE ?) ORDER BY last_seen DESC LIMIT 50";
    params = [me.id, cutoff, q, q];
  } else {
    sql = "SELECT id, name, friend_code, points, picture, last_seen FROM users WHERE id != ? AND last_seen > ? ORDER BY last_seen DESC LIMIT 50";
    params = [me.id, cutoff];
  }

  var stmt = db.prepare(sql);
  var result = await stmt.bind(...params).all();

  return Response.json({ ok: true, users: result.results || [] });
}
