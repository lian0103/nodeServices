require('dotenv').config();
// 到google develop console 先下載服務憑證
// https://console.cloud.google.com/apis/credentials?project=node-crawler-359702

const { google } = require('googleapis');

// spreadsheetId 於google sheet url中可取得
// https://docs.google.com/spreadsheets/d/1iqioigF8mhnWOxp-75E0yYAA0iFhzgWqQ167tzVGqjs/edit#gid=1845754049
const spreadsheetId = process.env.SAMPLE_SHEET_ID;

var auth = null;
var googleSheets = {};

async function initGoogle() {
  auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();
  googleSheets = google.sheets({ version: 'v4', auth: client });
}

async function appendSheet(rowsData = [[], []], sheetName = 'sheet1') {
  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:F`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rowsData,
      },
    });
  } catch (error) {
    console.log('appendSheet error', error);
  }
}

async function addSheet(sheetName) {
  try {
    await googleSheets.spreadsheets.batchUpdate({
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
  } catch (error) {}
}

async function getSheetsInfo() {
  try {
    const res = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
      includeGridData: false,
    });
    return res.data.sheets;
  } catch (error) {
    console.log('err in getSheetsInfo');
  }
}

async function updateSheetProperties(sheetObj) {
  let sheetId = sheetObj.properties.sheetId;
  try {
    const res = await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      auth,
      resource: {
        requests: [
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 1,
                endIndex: 2,
              },
              properties: {
                pixelSize: 600,
              },
              fields: 'pixelSize',
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 2,
                endIndex: 3,
              },
              properties: {
                pixelSize: 100,
              },
              fields: 'pixelSize',
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 3,
                endIndex: 4,
              },
              properties: {
                pixelSize: 100,
              },
              fields: 'pixelSize',
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 4,
                endIndex: 5,
              },
              properties: {
                pixelSize: 200,
              },
              fields: 'pixelSize',
            },
          },
          {
            updateCells: {
              range: {
                sheetId: sheetId,
                startColumnIndex: 4,
                endColumnIndex: 5,
                startRowIndex: 2,
                endRowIndex: 1000,
              },
              rows: [
                ...Array(50).fill({
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: 'CLIP',
                      },
                    },
                  ],
                }),
              ],
              fields: 'userEnteredFormat.wrapStrategy',
            },
            updateCells: {
              range: {
                sheetId: sheetId,
                startColumnIndex: 5,
                endColumnIndex: 6,
                startRowIndex: 1,
                endRowIndex: 1000,
              },
              rows: [
                ...Array(50).fill({
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: 'CLIP',
                      },
                    },
                  ],
                }),
              ],
              fields: 'userEnteredFormat.wrapStrategy',
            },
          },
        ],
      },
    });
    // console.log(res);
  } catch (error) {
    console.log('err in updateSheetProperties', error);
  }
}

module.exports = {
  initGoogle,
  appendSheet,
  addSheet,
  getSheetsInfo,
  updateSheetProperties,
};
