const dayjs = require('dayjs');
const { startCron } = require('./services/cron');
const { lineNotify } = require('./services/lineNotify');
const { itHomeCrawler } = require('./services/ithomeCrawler');
const fs = require('fs-extra');
const { resolve } = require('path');

async function notifyNewArticles(
  date,
  titleKeywords = ['vue', 'javascript', '前端']
) {
  const file = fs.readFileSync(
    resolve(__dirname, `./ithome2022/articles.json`),
    'utf-8'
  );

  let fileObject = JSON.parse(file);
  let notifyData = [`鐵人賽今日更新${titleKeywords.join()}文章:`];

  Object.keys(fileObject).forEach((key) => {
    fileObject[key].forEach((article) => {
      if (
        date === article.updateTime &&
        titleKeywords.some((kWord) =>
          article.title.toLowerCase().includes(kWord)
        )
      ) {
        notifyData.push(`${article.title} ${article.href}`);
      }
    });
  });

  let msg =
    notifyData.length == 1
      ? `${date}無${titleKeywords.join()}相關更新`
      : notifyData.join('\n\n');
  lineNotify(msg);
}

async function itHomeJobs(dateRange) {
  console.log(`開始執行2022itHome ${dateRange[0]}-${dateRange[1]} 排程作業 `);
  await itHomeCrawler(dateRange);

  await notifyNewArticles(dateRange[0]);

  console.log(
    `排程作業2022itHome執行完畢 ${dayjs().format('YYYY-MM-DD hh:mm')}`
  );
}

function genDateRange(target) {
  let arr = [];

  switch (target) {
    case 'before9': {
      arr = [
        dayjs().format('YYYY-MM-DD'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      ];
      break;
    }
    case 'today': {
      arr = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
      break;
    }
  }

  return arr;
}

startCron(() => {
  let arr = genDateRange('before9');
  itHomeJobs(arr);
}, '0 0 9 * * *');

startCron(() => {
  let arr = genDateRange('today');
  itHomeJobs(arr);
}, '0 0 12,16 * * *');
