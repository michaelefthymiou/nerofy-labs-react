# Stock, order log and order emails (Google Sheet)

One Google Sheet runs the shop's back office:

- **Stock** tab: change the "In stock" number or price and the website updates within a minute.
- **Orders** tab: every paid order appears here automatically, and stock goes down.
- **Enquiries** tab: every contact form message.
- You get an email for each order and enquiry. The customer gets a confirmation from info@nerofylabs.com.

## 1. Create the sheet
1. Go to sheets.new and name it **Nerofy Labs Store**.
2. Extensions > Apps Script. Delete everything in Code.gs.
3. Paste in the whole of apps-script/Code.gs from this project.
4. On line ~16 replace PASTE_YOUR_ORDER_SECRET_HERE with your secret (keep the quotes).
5. Save (Ctrl+S).

## 2. Create the tabs
1. In the function dropdown at the top pick **setup**, click **Run**.
2. Google asks for permission. Click Review permissions, pick your Gmail,
   Advanced > Go to project (unsafe) > Allow. (It is your own script, this is normal.)
3. Back in the sheet you now have Stock, Orders and Enquiries tabs. Delete the empty "Sheet1".

## 3. Publish it
1. Deploy > New deployment > gear icon > **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Deploy, then copy the **Web app URL** (ends in /exec).

## 4. Tell Netlify
Netlify > nerofy-labs > Project configuration > Environment variables > Add:
- GOOGLE_SCRIPT_URL = the /exec URL
- ORDER_SECRET = the same secret as in step 1.4

Then Deploys > Trigger deploy > Deploy site.

## Editing stock later
Just type the new number in the Stock tab. Never change the ID column.
A blank price means "enquiry only" (shows Get a quote).

If you edit Code.gs later: Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy.
The URL stays the same.
