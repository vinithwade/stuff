# Save waitlist emails to a Google Sheet

The form already works in **demo mode** (it just shows "You're on the list" and saves nothing).
Follow these 5 steps once to start saving real signups to a spreadsheet you own.

---

## 1. Create the sheet
- Go to <https://sheets.google.com> → **Blank spreadsheet**.
- Rename it something like **"Stuff Waitlist"**.

## 2. Open the script editor
- In the sheet: **Extensions → Apps Script**.
- Delete the sample `function myFunction() {}`.
- Open **`google-apps-script.gs`** from this project, copy ALL of it, paste it in, then **Save** (💾).

## 3. Initialize (creates the header row)
- In the Apps Script toolbar, pick the function **`setup`** in the dropdown → click **Run**.
- Google will ask for permission the first time → **Review permissions → choose your account → Advanced → "Go to … (unsafe)" → Allow**.
  (It's "unsafe" only because it's your own unverified script — it just writes to your sheet.)
- Check the sheet: a tab called **Waitlist** now has `Timestamp | Email | Source`.

## 4. Deploy as a Web app
- Top right: **Deploy → New deployment**.
- Click the gear ⚙ next to "Select type" → **Web app**.
- Set:
  - **Description:** waitlist
  - **Execute as:** **Me**
  - **Who has access:** **Anyone**
- **Deploy** → approve again if asked → **copy the Web app URL**
  (looks like `https://script.google.com/macros/s/AKfy............/exec`).

## 5. Connect the form
- Open **`app.js`** (top of the file) and paste your URL:
  ```js
  const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfy............/exec";
  ```
- Save. Done — submit a test email on the page and watch the row appear in your sheet. ✅

---

### Notes
- **Updating the script later?** After editing `google-apps-script.gs` in Apps Script, you must **Deploy → Manage deployments → edit (✏) → Version: New version → Deploy** for changes to go live. The URL stays the same.
- The browser sends the request "fire-and-forget" (`no-cors`) because Apps Script doesn't return CORS headers — so the page shows success as soon as the request is sent. If you want guaranteed delivery confirmation or spam protection later, move to a real backend (Supabase/serverless function).
- To get notified on each signup, add a Google Sheets notification rule: **Tools → Notification settings** (classic) or an `onChange` trigger.
