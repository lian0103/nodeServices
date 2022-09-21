const puppeteer = require('puppeteer');
const dayjs = require('dayjs');

async function puppetGetWebContent(webUrl) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(webUrl);
  const content = await page.content();
  await browser.close();

  return content;
}

async function puppetGoogleResultSave(keyword = 'iphone13') {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 1600,
    deviceScaleFactor: 1,
  });

  await page.goto(`https://www.google.com.tw/search?q=${keyword}`);

  let fileName = `${keyword}-${dayjs().format('YYYYMMDD-HHMM')}.png`;

  await page.screenshot({ path: `download/${fileName}` });

  await browser.close();
}

async function puppetGetWebContentWithUserArgs(webUrl) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
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
  puppetGoogleResultSave,
  puppetGetWebContentWithUserArgs,
};
