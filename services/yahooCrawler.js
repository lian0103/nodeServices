const cheerio = require("cheerio");
const { puppetGetWebContent } = require("./puppet");

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

module.exports = {
  yahooNewsCrawler,
};
