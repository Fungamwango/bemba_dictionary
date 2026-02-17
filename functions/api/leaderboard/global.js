// GET /api/leaderboard/global - top 30 users by points (legacy)
export async function onRequestGet(context) {
  var db = context.env.DB;
  var leaders = await db.prepare(
    "SELECT u.id, u.name, u.friend_code, u.points, u.picture, " +
    "(SELECT 1 FROM payments p WHERE p.device_id = u.device_id AND p.status = 'successful' " +
    "AND datetime(p.created_at, '+' || p.sub_days || ' days') > datetime('now') LIMIT 1) AS is_pro " +
    "FROM users u WHERE u.device_id != 'system_bemdic' ORDER BY u.points DESC LIMIT 40"
  ).all();
  return Response.json({ ok: true, leaders: leaders.results });
}

// POST /api/leaderboard/global - top 30 + current user rank
export async function onRequestPost(context) {
  var body = await context.request.json();
  var device_id = body.device_id;
  var db = context.env.DB;

  var leaders = await db.prepare(
    "SELECT u.id, u.name, u.friend_code, u.points, u.picture, u.device_id, " +
    "(SELECT 1 FROM payments p WHERE p.device_id = u.device_id AND p.status = 'successful' " +
    "AND datetime(p.created_at, '+' || p.sub_days || ' days') > datetime('now') LIMIT 1) AS is_pro " +
    "FROM users u WHERE u.device_id != 'system_bemdic' ORDER BY u.points DESC LIMIT 40"
  ).all();

  var result = { ok: true, leaders: leaders.results };

  // Check if current user is in top 30
  if (device_id) {
    var inTop = false;
    for (var i = 0; i < leaders.results.length; i++) {
      if (leaders.results[i].device_id === device_id) { inTop = true; break; }
    }

    if (!inTop) {
      var me = await db.prepare(
        "SELECT u.id, u.name, u.friend_code, u.points, u.picture, " +
        "(SELECT 1 FROM payments p WHERE p.device_id = u.device_id AND p.status = 'successful' " +
        "AND datetime(p.created_at, '+' || p.sub_days || ' days') > datetime('now') LIMIT 1) AS is_pro " +
        "FROM users u WHERE u.device_id = ?"
      ).bind(device_id).first();

      if (me) {
        var rankRow = await db.prepare(
          "SELECT COUNT(*) + 1 AS rank FROM users WHERE points > ? AND device_id != 'system_bemdic'"
        ).bind(me.points).first();

        result.my_rank = {
          rank: rankRow ? rankRow.rank : 0,
          id: me.id,
          name: me.name,
          friend_code: me.friend_code,
          points: me.points,
          picture: me.picture,
          is_pro: me.is_pro
        };
      }
    }

    // Strip device_id from response for privacy
    for (var j = 0; j < result.leaders.length; j++) {
      delete result.leaders[j].device_id;
    }
  }

  return Response.json(result);
}
