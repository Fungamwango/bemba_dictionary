// GET /api/settings/get - public endpoint to fetch app settings
export async function onRequestPost(context) {
  var db = context.env.DB;
  var rows = await db.prepare('SELECT key, value FROM settings').all();
  var settings = {};
  if (rows && rows.results) {
    for (var i = 0; i < rows.results.length; i++) {
      settings[rows.results[i].key] = rows.results[i].value;
    }
  }
  return Response.json({ ok: true, settings: settings });
}
