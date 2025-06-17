import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { google } from 'googleapis';
import fs from 'fs';

async function main() {
  /* 1) 認証セットアップ */
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS!,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.SPREADSHEET_ID!;

  /* 2) 最初のシート（タブ）名を取得 */
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetTitle =
    meta.data.sheets?.[0]?.properties?.title ??
    (() => {
      throw new Error('シートが 1 枚も見つかりません');
    })();

  /* 3) タブ全体を取得（A〜Z を 10 万行まで） */
  const range = `'${sheetTitle}'!A:Z`;
  const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  /* 4) 出力 */
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  fs.writeFileSync('dist/motk.json', JSON.stringify(data.values ?? [], null, 2));
  console.log(`✅  Export 完了 (${sheetTitle}) → dist/motk.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
