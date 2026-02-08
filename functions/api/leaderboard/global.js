// GET /api/leaderboard/global - top 50 users by points
export async function onRequestGet(context) {
  var db = context.env.DB;
  var leaders = await db.prepare(
    'SELECT name, friend_code, points, picture FROM users ORDER BY points DESC LIMIT 50'
  ).all();
  return Response.json({ ok: true, leaders: leaders.results });
}
