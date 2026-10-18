/**
 * Nerofy Labs store backend (Google Apps Script).
 *
 * One Google Sheet does three jobs:
 *   Stock      you edit stock and prices here, the website reads it
 *   Orders     every paid order is added automatically
 *   Enquiries  every contact form message is added automatically
 * You also get an email for each order and enquiry, and the customer
 * gets an order confirmation from info@nerofylabs.com.
 *
 * Setup steps are in apps-script/SETUP.md.
 */

// 1. Paste the same secret you put in Netlify as ORDER_SECRET
const SECRET = 'PASTE_YOUR_ORDER_SECRET_HERE';
// 2. Where order and enquiry alerts go
const NOTIFY_EMAIL = 'info@nerofylabs.com';
// 3. Customer emails are sent from this Gmail "Send mail as" address
const SEND_FROM = 'info@nerofylabs.com';
const LOW_STOCK_WARNING = 5;

/* ---------- run once from the editor: creates the tabs ---------- */
function setup() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, 'Stock', ['ID (do not change)', 'Product', 'Price (R, blank = enquiry only)', 'In stock'], [
    ['tap-filter', 'Countertop Faucet Filter', 299, 50],
    ['shower-filter', '15-Stage Shower Filter', 299, 0],
    ['undersink-ro', '5-Stage Undersink RO System', '', 0],
  ]);
  ensureSheet_(ss, 'Orders', ['Date', 'Reference', 'PayFast ID', 'Test?', 'Customer', 'Email', 'Phone',
    'Delivery', 'Address / locker', 'Items', 'Paid (R)', 'PayFast fee (R)', 'Status'], []);
  ensureSheet_(ss, 'Enquiries', ['Date', 'Name', 'Email', 'Phone', 'Interested in', 'Message', 'Status'], []);
}

function ensureSheet_(ss, name, headers, rows) {
  let sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sh.setFrozenRows(1);
  if (rows.length) sh.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  sh.autoResizeColumns(1, headers.length);
  return sh;
}

/* ---------- website reads stock ---------- */
function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName('Stock');
  const values = sh.getDataRange().getValues().slice(1);
  const products = values
    .filter(r => String(r[0]).trim())
    .map(r => ({ id: String(r[0]).trim(), price: r[2] === '' ? null : Number(r[2]), stock: Number(r[3]) || 0 }));
  return json_({ ok: true, products: products });
}

/* ---------- website sends orders and enquiries ---------- */
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad-json' }); }
  if (!SECRET || SECRET.indexOf('PASTE_') === 0 || body.secret !== SECRET) return json_({ ok: false, error: 'unauthorised' });
  if (body.type === 'order') return handleOrder_(body);
  if (body.type === 'enquiry') return handleEnquiry_(body);
  return json_({ ok: false, error: 'unknown-type' });
}

function handleOrder_(o) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActive();
    const orders = ss.getSheetByName('Orders');

    // PayFast can notify more than once. Only log each order once.
    const refs = orders.getLastRow() > 1 ? orders.getRange(2, 2, orders.getLastRow() - 1, 1).getValues().flat() : [];
    if (refs.indexOf(o.reference) !== -1) return json_({ ok: true, duplicate: true });

    orders.appendRow([new Date(), o.reference, o.payfastId, o.sandbox ? 'TEST' : '', o.name, o.email, o.phone,
      o.delivery, o.address, o.itemsText, o.amount, o.fee, 'New: to deliver']);

    // Take the items off stock
    const stock = ss.getSheetByName('Stock');
    const rows = stock.getDataRange().getValues();
    const low = [];
    (o.items || []).forEach(function (item) {
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === item.id) {
          const left = Math.max(0, (Number(rows[i][3]) || 0) - item.qty);
          stock.getRange(i + 1, 4).setValue(left);
          if (left <= LOW_STOCK_WARNING) low.push(rows[i][1] + ': ' + left + ' left');
        }
      }
    });

    notifyOwner_(o, low);
    confirmToCustomer_(o);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function handleEnquiry_(q) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Enquiries');
  sh.appendRow([new Date(), q.name, q.email, q.phone, q.interest, q.message, 'New']);
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: q.email,
    subject: 'New enquiry from ' + q.name + (q.interest ? ' (' + q.interest + ')' : ''),
    htmlBody: table_([
      ['Name', q.name], ['Email', q.email], ['Phone', q.phone || '-'], ['Interested in', q.interest || '-'],
      ['Message', q.message],
    ]) + '<p>Hit reply to answer them directly.</p>',
  });
  return json_({ ok: true });
}

function notifyOwner_(o, low) {
  const subject = (o.sandbox ? '[TEST] ' : '') + 'New order ' + o.reference + ': ' + o.itemsText;
  const html = '<h2 style="font-family:sans-serif">New paid order, ready to deliver</h2>' + table_([
    ['Reference', o.reference], ['Items', o.itemsText], ['Paid', 'R' + o.amount],
    ['Delivery', o.delivery + ' (R' + o.deliveryFee + ')'], ['Address / locker', o.address],
    ['Customer', o.name], ['Email', o.email], ['Phone', o.phone || '-'], ['PayFast ID', o.payfastId],
  ]) + (low.length ? '<p style="color:#b45309"><b>Low stock:</b> ' + low.join(', ') + '</p>' : '') +
    '<p>Mark the Status column in the Orders tab once delivered.</p>';
  MailApp.sendEmail({ to: NOTIFY_EMAIL, replyTo: o.email, subject: subject, htmlBody: html });
}

function confirmToCustomer_(o) {
  if (!o.email) return;
  const first = String(o.name).split(' ')[0];
  const subject = 'Your Nerofy Labs order ' + o.reference;
  const html = '<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#141a21">' +
    '<p>Hi ' + esc_(first) + ',</p><p>Thanks for your order. Your payment went through and we are getting it ready.</p>' +
    table_([['Order', o.reference], ['Items', o.itemsText], ['Delivery', o.delivery], ['Address / locker', o.address], ['Total paid', 'R' + o.amount]]) +
    '<p>We will send your tracking details as soon as it is on its way. Questions? Just reply to this email.</p>' +
    '<p>Nerofy Labs<br><a href="https://nerofylabs.com">nerofylabs.com</a></p></div>';
  const opts = { htmlBody: html, name: 'Nerofy Labs', replyTo: SEND_FROM };
  try {
    GmailApp.sendEmail(o.email, subject, 'Thanks for your order ' + o.reference, Object.assign({ from: SEND_FROM }, opts));
  } catch (err) {
    MailApp.sendEmail({ to: o.email, subject: subject, htmlBody: html, name: 'Nerofy Labs', replyTo: SEND_FROM });
  }
}

function table_(rows) {
  return '<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' +
    rows.map(function (r) {
      return '<tr><td style="color:#5d6874;border-bottom:1px solid #eee"><b>' + r[0] + '</b></td>' +
        '<td style="border-bottom:1px solid #eee">' + esc_(r[1]).replace(/\n/g, '<br>') + '</td></tr>';
    }).join('') + '</table>';
}

function esc_(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
