const { yahooNewsCrawler } = require("./services/yahooCrawler");
const { appendSheet, batchUpdateSheet } = require("./services/googleSheets");

async function start() {
  console.log("----crawler start----");
  const result = await yahooNewsCrawler();
  const rows = result.map((item) =>
    Object.values({ 0: item.time, 1: item.title, 2: item.href })
  );

  console.log("----appendSheet start----");
  let sheetName = new Date().toISOString().split("T")[0];
  await batchUpdateSheet(sheetName);
  await appendSheet(rows, sheetName);
}

start();
