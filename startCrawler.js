const { itHomeCrawler } = require('./services/ithomeCrawler');
const dayjs = require('dayjs');
let dateRange = ['2022-11-01', dayjs().format('YYYY-MM-DD')];

console.log(`開始執行2022itHome ${dateRange[0]}-${dateRange[1]} 排程作業 `);

await itHomeCrawler(dateRange);

console.log(`排程作業2022itHome執行完畢 ${dayjs().format('YYYY-MM-DD hh:mm')}`);
