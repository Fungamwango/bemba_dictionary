// POST /api/admin/stats - dashboard stats
export async function onRequestPost(context) {
  var result = await verifyAdmin(context);
  if (result.error) return result.error;

  var db = context.env.DB;

  // Online now: last_seen within last 5 minutes
  var onlineRow = await db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE last_seen >= datetime('now', '-5 minutes')"
  ).first();

  // New users today
  var newTodayRow = await db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')"
  ).first();

  // Total users
  var totalRow = await db.prepare('SELECT COUNT(*) as count FROM users').first();

  // Daily visitors last 7 days
  var visitsResult = await db.prepare(
    "SELECT date, count FROM daily_visits WHERE date >= date('now', '-6 days') ORDER BY date ASC"
  ).all();

  // Fill in missing days with 0
  var visitsMap = {};
  var rows = visitsResult.results || [];
  for (var i = 0; i < rows.length; i++) visitsMap[rows[i].date] = rows[i].count;

  var daily = [];
  for (var d = 6; d >= 0; d--) {
    var dt = new Date(Date.now() - d * 86400000).toISOString().substring(0, 10);
    daily.push({ date: dt, count: visitsMap[dt] || 0 });
  }

  // Subscriptions: paid today
  var paidTodayRow = await db.prepare(
    "SELECT COUNT(*) as count FROM payments WHERE status='successful' AND date(created_at) = date('now')"
  ).first();

  // Currently subscribed: successful payment where created_at + sub_days is still in future
  var subscribedRow = await db.prepare(
    "SELECT COUNT(DISTINCT device_id) as count FROM payments WHERE status='successful' AND datetime(created_at, '+' || sub_days || ' days') > datetime('now')"
  ).first();

  // Total earnings
  var earningsRow = await db.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status='successful'"
  ).first();

  return Response.json({
    ok: true,
    online_now: onlineRow ? onlineRow.count : 0,
    new_today: newTodayRow ? newTodayRow.count : 0,
    total_users: totalRow ? totalRow.count : 0,
    daily_visitors: daily,
    paid_today: paidTodayRow ? paidTodayRow.count : 0,
    subscribed_now: subscribedRow ? subscribedRow.count : 0,
    total_earnings: earningsRow ? earningsRow.total : 0
  });
}

async function verifyAdmin(context) {
  var body;
  try { body = await context.request.json(); } catch(e) {
    return { error: Response.json({ ok: false, error: 'Invalid request' }, { status: 400 }) };
  }
  var token = body.token;
  if (!token) return { error: Response.json({ ok: false, error: 'Token required' }, { status: 401 }) };
  var parts = token.split('.');
  if (parts.length !== 2) return { error: Response.json({ ok: false, error: 'Invalid token' }, { status: 401 }) };
  var ts = parts[0];
  var sig = parts[1];
  var age = Date.now() - parseInt(ts);
  if (age > 86400000 || age < 0) return { error: Response.json({ ok: false, error: 'Token expired' }, { status: 401 }) };
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return { error: Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 }) };
  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var expectedHex = Array.from(new Uint8Array(expected)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  if (sig !== expectedHex) return { error: Response.json({ ok: false, error: 'Invalid token' }, { status: 401 }) };
  return { body: body };
}
