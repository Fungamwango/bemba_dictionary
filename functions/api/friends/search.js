// POST /api/friends/search - search users by name or friend code
export async function onRequestPost(context) {
  var { device_id, query } = await context.request.json();
  if (!device_id || !query) {
    return Response.json({ ok: false, error: 'device_id and query required' }, { status: 400 });
  }
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  query = query.trim();
  var results;

  // If query looks like a friend code (6 alphanumeric chars), search by code too
  if (/^[A-Z0-9]{6}$/i.test(query)) {
    results = await db.prepare(
      'SELECT id, name, friend_code, points, picture FROM users WHERE (friend_code = ? OR name LIKE ?) AND id != ? LIMIT 20'
    ).bind(query.toUpperCase(), '%' + query + '%', me.id).all();
  } else {
    results = await db.prepare(
      'SELECT id, name, friend_code, points, picture FROM users WHERE name LIKE ? AND id != ? LIMIT 20'
    ).bind('%' + query + '%', me.id).all();
  }

  return Response.json({ ok: true, results: results.results });
}
