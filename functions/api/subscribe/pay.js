// POST /api/subscribe/pay - Initiate MoneyUnify mobile money payment
export async function onRequestPost(context) {
  var { phone, device_id } = await context.request.json();
  if (!phone || !device_id) {
    return Response.json({ ok: false, error: 'phone and device_id required' }, { status: 400 });
  }

  var db = context.env.DB;
  var MU_AUTH_ID = context.env.MU_AUTH_ID;
  if (!MU_AUTH_ID) {
    return Response.json({ ok: false, error: 'Payment not configured' }, { status: 500 });
  }

  // Config: read from DB settings first, fall back to env vars
  var AMOUNT = context.env.SUB_AMOUNT || '5';
  var SUB_DAYS = parseInt(context.env.SUB_DAYS || '7');
  try {
    var sRows = await db.prepare("SELECT key, value FROM settings WHERE key IN ('payment_amount','sub_days')").all();
    if (sRows && sRows.results) {
      for (var i = 0; i < sRows.results.length; i++) {
        if (sRows.results[i].key === 'payment_amount') AMOUNT = sRows.results[i].value.replace(/[^0-9.]/g, '') || AMOUNT;
        if (sRows.results[i].key === 'sub_days') SUB_DAYS = parseInt(sRows.results[i].value) || SUB_DAYS;
      }
    }
  } catch(e) {}

  // Clean phone number: accept 09xx or 260xx format
  var cleanPhone = phone.replace(/\s+/g, '');
  if (/^260\d{9}$/.test(cleanPhone)) {
    cleanPhone = '0' + cleanPhone.substring(3);
  }
  if (!/^0\d{9}$/.test(cleanPhone)) {
    return Response.json({ ok: false, error: 'Invalid Zambian phone number' }, { status: 400 });
  }

  // Call MoneyUnify payment request API
  var muResp = await fetch('https://api.moneyunify.one/payments/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      from_payer: cleanPhone,
      amount: AMOUNT,
      auth_id: MU_AUTH_ID
    }).toString()
  });

  var muData = await muResp.json();

  if (!muData.isError && muData.data && muData.data.transaction_id) {
    var txId = muData.data.transaction_id;

    // Store payment record with MoneyUnify transaction_id as tx_ref
    await db.prepare(
      'INSERT INTO payments (tx_ref, phone, amount, currency, device_id, sub_days, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(txId, cleanPhone, parseFloat(AMOUNT), 'ZMW', device_id, SUB_DAYS, 'pending').run();

    return Response.json({
      ok: true,
      tx_ref: txId,
      message: 'Check your phone for a payment prompt. Enter your PIN to confirm.'
    });
  } else {
    return Response.json({
      ok: false,
      error: muData.message || 'Payment initiation failed. Try again.'
    });
  }
}
