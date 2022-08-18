require("dotenv").config();
// 到google develop console 先下載服務憑證
// https://console.cloud.google.com/apis/credentials?project=node-crawler-359702

const { google } = require("googleapis");

// spreadsheetId 於google sheet url中可取得
// https://docs.google.com/spreadsheets/d/"""1iqioigF8mhnWOxp-75E0yYAA0iFhzgWqQ167tzVGqjs"""/edit#gid=1845754049
const spreadsheetId = process.env.SAMPLE_SHEET_ID;

async function initGoogle() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  return { auth, googleSheets };
}

async function appendSheet(rowsData = [[], []], sheetName = "sheet1") {
  let { auth, googleSheets } = await initGoogle();

  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:C`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: rowsData,
      },
    });
  } catch (error) {
    console.log("appendSheet error", error);
  }
}

async function batchUpdateSheet(sheetName) {
  let { auth, googleSheets } = await initGoogle();

  try {
    const res = await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      auth,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });
    console.log(res.data.spreadsheetId + "add sheet finished");
  } catch (error) {}
}

module.exports = {
  initGoogle,
  appendSheet,
  batchUpdateSheet,
};
