/* =========================
   MOTKsheets Apps Script
   ========================= */

function onEdit(e) {
  const sheet = e.range.getSheet();
  // 検証対象タブのみ実行
  if (!['shots', 'tasks', 'assets'].includes(sheet.getName())) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  validateRow(sheet, e.range.getRow(), headers);
  archiveIfNeeded(sheet, 750);
}
