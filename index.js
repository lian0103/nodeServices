const { yahooNewsCrawler } = require('./services/yahooCrawler');
const { appendSheet, batchUpdateSheet } = require('./services/googleSheets');
const { lineNotify } = require('./services/lineNotify');
const dayjs = require('dayjs');
const shortUrl = require('node-url-shortener');

async function main() {
  console.log('----crawler start----');
  const result = await yahooNewsCrawler();
  const rows = result.map((item) =>
    Object.values({ 0: item.time, 1: item.title, 2: item.href })
  );

  console.log('----appendSheet start----');
  let sheetName = dayjs().format('YYYY-MM-DD hh mm'); //不能有dash符號
  await batchUpdateSheet(sheetName);
  await appendSheet(rows, sheetName);

  console.log('----notify start----');
  let promiseArr = [];
  result.slice(1, 4).forEach((item) => {
    promiseArr.push(
      new Promise((resolv, reject) => {
        shortUrl.short(item.href, (err, url) => {
          console.log('url', url);
          resolv(url);
        });
      })
    );
  });

  Promise.all(promiseArr).then((resAll) => {
    console.log('resAll', resAll);
    lineNotify(`排程作業執行完畢！ ${dayjs().format(
      'YYYY-MM-DD hh:mm'
    )}\n${result
      .slice(1, 4)
      .map((item, idx) => {
        return `${item.title} ${resAll[idx]}`;
      })
      .join('\n')}
    `).catch((err) => {
      lineNotify('notify error', err);
    });
  });
}

main();
