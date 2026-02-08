// POST /api/notifications/poll - get notifications + update last_seen (heartbeat)
export async function onRequestPost(context) {
  var { device_id, offset } = await context.request.json();
  if (!device_id) return Response.json({ ok: false, error: 'device_id required' }, { status: 400 });
  var db = context.env.DB;
  var me = await db.prepare('SELECT id FROM users WHERE device_id = ?').bind(device_id).first();
  if (!me) return Response.json({ ok: false, error: 'User not found' }, { status: 404 });

  // Update last_seen (heartbeat)
  var nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19);
  await db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').bind(nowUtc, me.id).run();

  var off = parseInt(offset) || 0;
  var limit = 20;

  // Get notifications with pagination
  var notifs = await db.prepare(
    'SELECT id, type, data, read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(me.id, limit + 1, off).all();

  var results = notifs.results || [];
  var hasMore = results.length > limit;
  if (hasMore) results = results.slice(0, limit);

  // Count unread
  var unread = await db.prepare(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'
  ).bind(me.id).first();

  // Opportunistic cleanup: ~1% chance per poll
  if (Math.random() < 0.01) {
    // Expire pending challenges older than 7 days
    var cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    db.prepare("UPDATE challenges SET status = 'expired' WHERE status = 'pending' AND created_at < ?").bind(cutoff7d).run().catch(function() {});

    // Purge users inactive for 90+ days and all their data
    var cutoff90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    db.prepare('SELECT id FROM users WHERE last_seen < ?').bind(cutoff90).all().then(function(inactive) {
      var ids = (inactive.results || []).map(function(u) { return u.id; });
      if (!ids.length) return;
      var ph = ids.map(function() { return '?'; }).join(',');
      db.prepare('DELETE FROM notifications WHERE user_id IN (' + ph + ')').bind(...ids).run();
      db.prepare('DELETE FROM challenges WHERE sender_id IN (' + ph + ') OR receiver_id IN (' + ph + ')').bind(...ids, ...ids).run();
      db.prepare('DELETE FROM friends WHERE requester_id IN (' + ph + ') OR addressee_id IN (' + ph + ')').bind(...ids, ...ids).run();
      db.prepare('DELETE FROM users WHERE id IN (' + ph + ')').bind(...ids).run();
    }).catch(function() {});
  }

  return Response.json({
    ok: true,
    notifications: results,
    unread_count: unread ? unread.count : 0,
    has_more: hasMore
  });
}
