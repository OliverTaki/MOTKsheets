/**
 * 行数が limit を超えたら新タブへ自動アーカイブ
 * 新タブ名: <元タブ名>_002, _003 …
 */
function archiveIfNeeded(sheet, limit) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= limit) return;

  const prefix = sheet.getName();
  // 既存アーカイブの最大番号を取得
  const siblings = sheet.getParent().getSheets();
  const maxIdx = siblings
    .map((s) => s.getName())
    .filter((n) => n.startsWith(prefix + '_'))
    .reduce((m, n) => Math.max(m, Number(n.split('_').pop())), 1);

  const newTab = sheet.copyTo(sheet.getParent()).setName(
    `${prefix}_${String(maxIdx + 1).padStart(3, '0')}`
  );
  // ヘッダ行を残してデータを移動
  const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  dataRange.copyTo(newTab.getRange(2, 1));
  dataRange.clearContent();
}
