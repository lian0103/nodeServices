const puppeteer = require("puppeteer");

async function puppetGetWebContent(webUrl) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(webUrl);
  const content = await page.content();
  await browser.close();

  return content;
}

module.exports = {
  puppetGetWebContent,
};
