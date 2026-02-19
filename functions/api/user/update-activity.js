// POST /api/user/update-activity - update user activity status
export async function onRequestPost(context) {
  var { device_id, status } = await context.request.json();
  if (!device_id) {
    return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var user = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!user) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  if (status === 'offline') {
    var oldTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    await db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(oldTimestamp, user.id).run();
  } else {
    var nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(nowUtc, user.id).run();

    // Track unique daily visit
    var todayDate = new Date().toISOString().substring(0, 10);
    var visit = await db.prepare(
      'INSERT OR IGNORE INTO user_visits (user_id, date) VALUES (?, ?)'
    ).bind(user.id, todayDate).run();

    if (visit.meta && visit.meta.changes > 0) {
      // First visit today — increment daily_visits counter
      await db.prepare('INSERT OR IGNORE INTO daily_visits (date, count) VALUES (?, 0)').bind(todayDate).run();
      await db.prepare('UPDATE daily_visits SET count = count + 1 WHERE date = ?').bind(todayDate).run();
    }
  }

  return Response.json({ ok: true });
}
