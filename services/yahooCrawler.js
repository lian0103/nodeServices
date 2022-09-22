const cheerio = require("cheerio");
const { puppetGetWebContent } = require("./puppet");
const dayjs = require('dayjs');
const {
  initGoogle,
  appendSheet,
  addSheet,
  getSheetsInfo,
  updateSheetProperties,
} = require('./googleSheets');
const { lineNotify } = require('./lineNotify');

async function yahooNewsCrawler() {
  const content = await puppetGetWebContent("https://tw.yahoo.com/");
  const $ = cheerio.load(content);
  const eles = $("a");

  let arr = [];
  let targetReg = /^(https:\/\/tw.news.yahoo.com)/;
  let filterReg =
    /\/weather\/|\/entertainment\/|\/entertainment|\/technology\//;
  for (let i = 0; i < eles.length; i++) {
    let href = eles.eq(i).attr("href");
    if (targetReg.test(href) && !href.match(filterReg)) {
      arr.push({
        time: new Date().toISOString(),
        title: eles.eq(i)?.attr("data-ylk")?.split("slk:")[1]?.split(";")[0],
        href: href,
      });
    }
  }
  // console.log(arr);
  arr.shift();
  
  return arr;
}

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

module.exports = {
  yahooNewsCrawlerImplement
};
