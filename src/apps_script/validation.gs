/**
 * 行単位バリデーション
 * 必須列: uid / status / created_at
 */
function validateRow(sheet, row, headers) {
  if (row === 1) return; // ヘッダ行は無視

  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const idx = (key) => headers.indexOf(key);
  const required = ['uid', 'status', 'created_at'];

  const hasError = required.some((k) => values[idx(k)] === '');
  sheet
    .getRange(row, 1, 1, headers.length)
    .setBackground(hasError ? '#ffcccc' : '#ffffff');
}
