const { yahooNewsCrawler } = require('./services/yahooCrawler');
const {
  initGoogle,
  appendSheet,
  addSheet,
  getSheetsInfo,
  updateSheetProperties,
} = require('./services/googleSheets');
const { lineNotify } = require('./services/lineNotify');
const { startCron } = require('./services/cron');
const dayjs = require('dayjs');

const express = require('express');
const app = express();

var isCronBeenCall = false;

async function main() {
  console.log('----crawler start----');
  const result = await yahooNewsCrawler();
  const rows = result.map((item) =>
    Object.values({ 0: item.time, 1: item.title, 2: item.href })
  );

  // console.log('----appendSheet start----');
  // await initGoogle();
  // let sheetName = dayjs().format('YYYYMMDDhhmm'); //表單名稱不能有特殊符號
  // await addSheet(sheetName);
  // await appendSheet(rows, sheetName);
  // let sheetInfo = await getSheetsInfo();
  // await updateSheetProperties(sheetInfo[sheetInfo.length - 1]);

  console.log('----notify start----');
  lineNotify(`排程作業執行完畢！ ${dayjs().format('YYYY-MM-DD hh:mm')}\n${result
    .map((item, idx) => {
      return `${item.title}`;
    })
    .join('\n')}
  `).catch((err) => {
    lineNotify('notify error', err);
  });
}

app.get('/startCron', async (req, res) => {
  if (!isCronBeenCall) {
    startCron(main);
    isCronBeenCall = true;
  }

  res.send(`startCron~~~~ ${isCronBeenCall}`);
});

app.listen(3030, () => {
  console.log('app is listening at 3030');
});
