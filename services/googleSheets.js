const { google } = require("googleapis");

const spreadsheetId = "1iqioigF8mhnWOxp-75E0yYAA0iFhzgWqQ167tzVGqjs";

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
