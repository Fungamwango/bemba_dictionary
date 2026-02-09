// POST /api/admin/login
export async function onRequestPost(context) {
  var { phone, password } = await context.request.json();
  if (!phone || !password) {
    return Response.json({ ok: false, error: 'Phone and password required' }, { status: 400 });
  }

  var ADMIN_PHONE = context.env.ADMIN_PHONE;
  var ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
  if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: 'Admin not configured' }, { status: 500 });
  }

  if (phone.trim() !== ADMIN_PHONE || password !== ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  }

  // Generate stateless token: timestamp.signature
  var ts = Date.now().toString();
  var key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(ADMIN_PASSWORD),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
  var sigHex = Array.from(new Uint8Array(sig)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');

  return Response.json({ ok: true, token: ts + '.' + sigHex });
}
