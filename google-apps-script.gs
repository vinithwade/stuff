/**
 * Stuff — Waitlist collector (Google Apps Script)
 * Receives POSTs from the landing page form and appends a row to your Sheet.
 *
 * SETUP (full steps in SETUP-waitlist.md):
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Delete any sample code, paste THIS file, Save.
 *   3. Run `setup` once (creates the header row; approve permissions).
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me   |   Who has access: Anyone
 *   5. Copy the Web app URL → paste it into WAITLIST_ENDPOINT in app.js.
 */

var SHEET_NAME = 'Waitlist';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'Source']);
    sheet.getRange('A1:C1').setFontWeight('bold');
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Body may arrive as JSON (text/plain) or form params
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (err) { data = e.parameter || {}; }
    } else {
      data = (e && e.parameter) || {};
    }

    var email = (data.email || '').toString().trim();
    if (!email) return json({ ok: false, error: 'no email' });

    sheet.appendRow([new Date(), email, data.source || 'landing']);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
