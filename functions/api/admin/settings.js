// POST /api/admin/settings - get or update app settings (admin only for updates)
export async function onRequestPost(context) {
  var body = await context.request.json();
  var action = body.action;

  var db = context.env.DB;

  // Get settings - no auth needed
  if (action === 'get') {
    var rows = await db.prepare('SELECT key, value FROM settings').all();
    var settings = {};
    if (rows && rows.results) {
      for (var i = 0; i < rows.results.length; i++) {
        settings[rows.results[i].key] = rows.results[i].value;
      }
    }
    return Response.json({ ok: true, settings: settings });
  }

  // Update settings - auth required
  if (action === 'update') {
    var authErr = await verifyAdmin(context);
    if (authErr) return authErr;

    var settings = body.settings;
    if (!settings || typeof settings !== 'object') {
      return Response.json({ ok: false, error: 'settings object required' }, { status: 400 });
    }

    var allowed = ['free_word_limit', 'free_quiz_limit', 'sub_days', 'payment_amount', 'payment_number'];
    var keys = Object.keys(settings);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (allowed.indexOf(k) === -1) continue;
      var v = String(settings[k]).trim();
      if (!v) continue;
      await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(k, v).run();
    }

    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: 'Invalid action' }, { status: 400 });
}

async function verifyAdmin(context) {
  var body;
  try { body = await context.request.clone().json(); } catch(e) {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
  var token = body.token;
  if (!token) return Response.json({ ok: false, error: 'Token required' }, { status: 401 });
  var parts = token.split('.');
  if (parts.length !== 2) return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  var ts = parts[0];
  var sig = parts[1];
  var age = Date.now() - parseInt(ts);
  if (age > 86400000 || age < 0) return Response.json({ ok: false, error: 'Token expired' }, { status: 401 });
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 });
  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var expectedHex = Array.from(new Uint8Array(expected)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  if (sig !== expectedHex) return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  return null;
}
