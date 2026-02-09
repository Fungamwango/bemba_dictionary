// POST /api/subscribe/verify - Verify payment with MoneyUnify and return subscription code
export async function onRequestPost(context) {
  var { tx_ref, device_id } = await context.request.json();
  if (!tx_ref || !device_id) {
    return Response.json({ ok: false, error: 'tx_ref and device_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var payment = await db.prepare(
    'SELECT status, sub_days FROM payments WHERE tx_ref = ? AND device_id = ?'
  ).bind(tx_ref, device_id).first();

  if (!payment) {
    return Response.json({ ok: false, error: 'Payment not found' }, { status: 404 });
  }

  // Already confirmed
  if (payment.status === 'successful') {
    return Response.json({
      ok: true,
      status: 'successful',
      subscription_code: generateSubCode(context, payment.sub_days),
      sub_days: payment.sub_days
    });
  }

  if (payment.status === 'failed') {
    return Response.json({ ok: true, status: 'failed' });
  }

  // Still pending — verify with MoneyUnify
  var MU_AUTH_ID = context.env.MU_AUTH_ID;
  if (!MU_AUTH_ID) {
    return Response.json({ ok: true, status: 'pending' });
  }

  var muResp = await fetch('https://api.moneyunify.one/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      transaction_id: tx_ref,
      auth_id: MU_AUTH_ID
    }).toString()
  });

  var muData = await muResp.json();

  if (!muData.isError && muData.data) {
    var txStatus = muData.data.status;

    if (txStatus === 'successful') {
      await db.prepare('UPDATE payments SET status = ?, provider_ref = ? WHERE tx_ref = ?')
        .bind('successful', muData.data.transaction_id || '', tx_ref).run();

      return Response.json({
        ok: true,
        status: 'successful',
        subscription_code: generateSubCode(context, payment.sub_days),
        sub_days: payment.sub_days
      });
    } else if (txStatus === 'failed') {
      await db.prepare('UPDATE payments SET status = ? WHERE tx_ref = ?')
        .bind('failed', tx_ref).run();
      return Response.json({ ok: true, status: 'failed' });
    }
  }

  // Still pending (initiated, otp-pending, etc.)
  return Response.json({ ok: true, status: 'pending' });
}

// Generate a valid subscription code (same algorithm as code-generator.html)
function generateSubCode(context, subDays) {
  var SUB_SECRET = parseInt(context.env.SUB_SECRET || '7391');
  var days = subDays || 7;
  var today = Math.floor(Date.now() / 86400000);
  var expiryDay = today + days;

  var encoded = expiryDay ^ SUB_SECRET;
  var payload = encoded.toString(16).toUpperCase();

  // Checksum
  var sum = 0;
  for (var i = 0; i < payload.length; i++) {
    sum = ((sum << 5) - sum + payload.charCodeAt(i)) & 0xFFFF;
  }
  var hex = sum.toString(16).toUpperCase();
  while (hex.length < 4) hex = '0' + hex;

  return payload + hex;
}
