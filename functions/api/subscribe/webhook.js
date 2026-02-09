// POST /api/subscribe/webhook - Optional webhook for MoneyUnify payment callbacks
export async function onRequestPost(context) {
  var body = await context.request.json();
  var data = body.data || body;
  var txRef = data.transaction_id || data.tx_ref;
  var status = data.status;

  if (!txRef) {
    return new Response('Missing transaction_id', { status: 400 });
  }

  var db = context.env.DB;
  var payment = await db.prepare('SELECT * FROM payments WHERE tx_ref = ?').bind(txRef).first();
  if (!payment || payment.status === 'successful') {
    return new Response('OK', { status: 200 });
  }

  if (status === 'successful') {
    await db.prepare('UPDATE payments SET status = ? WHERE tx_ref = ?').bind('successful', txRef).run();
  } else if (status === 'failed') {
    await db.prepare('UPDATE payments SET status = ? WHERE tx_ref = ?').bind('failed', txRef).run();
  }

  return new Response('OK', { status: 200 });
}
