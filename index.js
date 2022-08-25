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
const { momoCrawler } = require('./services/momoCrawler');
const dayjs = require('dayjs');

require('events').EventEmitter.defaultMaxListeners = 100;

async function yahooNewsCrawlerImplement() {
  console.log('----crawler start----');
  const result = await yahooNewsCrawler();
  const rows = result.map((item) =>
    Object.values({ 0: item.time, 1: item.title, 2: item.href })
  );

  console.log('----appendSheet start----');
  await initGoogle();
  let sheetName = dayjs().format('YYYYMMDDhhmm');
  await addSheet(sheetName);
  await appendSheet(rows, sheetName);
  let sheetInfo = await getSheetsInfo();
  await updateSheetProperties(sheetInfo[sheetInfo.length - 1]);

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

async function momoCrawlerImplement(targetArr) {
  console.log('----appendSheet start----');
  let rowsTitle = [
    ['搜尋字', '名稱-momo', '價錢-momo', '標籤-momo', '網址-momo', '縮圖-momo'],
  ];

  await initGoogle();
  let sheetName = dayjs().format('YYYYMMDDhhmm') + '-MOMO';
  await addSheet(sheetName);
  await appendSheet(rowsTitle, sheetName);

  for(let idx in targetArr){
    let item = targetArr[idx];
    let keyword = `${item.brand} ${item.productName}`;
    console.log('----crawler start----', keyword);
    let res = await momoCrawler(keyword);
    let rows = [];
    res.forEach((rItem, rIdx) => {
      rows.push(
        Object.values({
          搜尋字: rIdx == 0 ? `${item.brand} ${item.productName}` : '',
          名稱: rItem?.name,
          價錢: rItem?.price,
          標籤: rItem?.tags.join(';'),
          縮圖: rItem?.img,
          網址: rItem?.url,
        })
      );
    });
    console.log('----appendSheet start----');
    await appendSheet(rows, sheetName);
  }


  let sheetInfo = await getSheetsInfo();
  await updateSheetProperties(sheetInfo[sheetInfo.length - 1]);
}

const targetArr = [
  { brand: 'apple', productName: 'megsafe' },
  { brand: '', productName: '美國牛' },
  { brand: '郭元益', productName: '鳳梨酥' },
];

momoCrawlerImplement(targetArr);

