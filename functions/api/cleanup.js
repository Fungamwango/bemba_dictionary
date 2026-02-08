// GET /api/cleanup - purge users inactive for 90+ days and their associated data
export async function onRequestGet(context) {
  var db = context.env.DB;
  var cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);

  // Find inactive users
  var inactive = await db.prepare(
    'SELECT id FROM users WHERE last_seen < ?'
  ).bind(cutoff).all();

  var ids = (inactive.results || []).map(function(u) { return u.id; });
  if (!ids.length) {
    return Response.json({ ok: true, purged: 0 });
  }

  var placeholders = ids.map(function() { return '?'; }).join(',');

  // Delete in order: notifications, challenges, friends, then users
  await db.prepare(
    'DELETE FROM notifications WHERE user_id IN (' + placeholders + ')'
  ).bind(...ids).run();

  await db.prepare(
    'DELETE FROM challenges WHERE sender_id IN (' + placeholders + ') OR receiver_id IN (' + placeholders + ')'
  ).bind(...ids, ...ids).run();

  await db.prepare(
    'DELETE FROM friends WHERE requester_id IN (' + placeholders + ') OR addressee_id IN (' + placeholders + ')'
  ).bind(...ids, ...ids).run();

  await db.prepare(
    'DELETE FROM users WHERE id IN (' + placeholders + ')'
  ).bind(...ids).run();

  return Response.json({ ok: true, purged: ids.length });
}
