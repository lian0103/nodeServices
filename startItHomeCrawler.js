const { itHomeCrawler } = require("./services/ithomeCrawler");
const dayjs = require("dayjs");
let dateRange = ["2023-09-01", dayjs().format("YYYY-MM-DD")];

async function run() {
  console.log(`開始執行2023itHome ${dateRange[0]}-${dateRange[1]} 排程作業 `);
  await itHomeCrawler(dateRange);

  console.log(
    `排程作業2023itHome執行完畢 ${dayjs().format("YYYY-MM-DD hh:mm")}`
  );
}

run();
