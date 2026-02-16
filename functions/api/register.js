// POST /api/register - register new user or return existing
function generateFriendCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function onRequestPost(context) {
  var { device_id, name } = await context.request.json();
  if (!device_id || !name) {
    return Response.json({ ok: false, error: 'device_id and name required' }, { status: 400 });
  }
  name = name.trim().substring(0, 50);
  if (name.length < 3) {
    return Response.json({ ok: false, error: 'Name must be at least 3 characters' }, { status: 400 });
  }
  var db = context.env.DB;

  // Check if user already exists
  var existing = await db.prepare('SELECT * FROM users WHERE device_id = ?').bind(device_id).first();
  if (existing) {
    return Response.json({ ok: true, user: existing });
  }

  // Generate unique friend code (retry on collision)
  var friend_code;
  for (var i = 0; i < 10; i++) {
    friend_code = generateFriendCode();
    var dup = await db.prepare('SELECT id FROM users WHERE friend_code = ?').bind(friend_code).first();
    if (!dup) break;
  }

  var nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19);
  var user = await db.prepare(
    'INSERT INTO users (device_id, name, friend_code, last_seen) VALUES (?, ?, ?, ?) RETURNING *'
  ).bind(device_id, name, friend_code, nowUtc).first();

  // --- Welcome challenge from BemDic (picks a random played challenge from DB) ---
  try {
    var bemdic = await db.prepare("SELECT id, name FROM users WHERE device_id = 'system_bemdic'").first();
    if (!bemdic) {
      var bemdicLastSeen = new Date().toISOString().replace('T', ' ').substring(0, 19);
      bemdic = await db.prepare(
        "INSERT INTO users (device_id, name, friend_code, points, last_seen) VALUES ('system_bemdic', 'BemDic', 'BEMDIC', 1, ?) RETURNING *"
      ).bind(bemdicLastSeen).first();
    }

    // Pick a random existing challenge (not from BemDic itself) to reuse its questions
    var existing = await db.prepare(
      "SELECT questions, sender_score FROM challenges WHERE sender_id != ? ORDER BY RANDOM() LIMIT 1"
    ).bind(bemdic.id).first();

    if (existing) {
      var welcomeMsg = 'Welcome to BemDic! Try beating my score \uD83D\uDE0A';
      var welcomeChallenge = await db.prepare(
        "INSERT INTO challenges (sender_id, receiver_id, sender_score, questions, message) VALUES (?, ?, ?, ?, ?) RETURNING *"
      ).bind(bemdic.id, user.id, existing.sender_score, existing.questions, welcomeMsg).first();

      await db.prepare(
        "INSERT INTO notifications (user_id, type, data) VALUES (?, 'challenge_received', ?)"
      ).bind(user.id, JSON.stringify({
        challenge_id: welcomeChallenge.id,
        from_name: 'BemDic',
        from_id: bemdic.id,
        sender_score: existing.sender_score,
        message: welcomeMsg,
        from_picture: ''
      })).run();
    }
  } catch(e) {
    // Welcome challenge is non-critical; don't fail registration
  }

  return Response.json({ ok: true, user: user }, { status: 201 });
}
