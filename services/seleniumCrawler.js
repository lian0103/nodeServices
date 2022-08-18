require("dotenv").config();
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const options = new chrome.Options();
options.setUserPreferences({
  "profile.default_content_setting_values.notifications": 1,
});

let driver = null;

const crawlerPathMap = {
  fb_email: `//*[@id="email"]`,
  fb_pass: `//*[@id="pass"]`,
  fb_login_btn: `//*[@id="loginbutton"]`,
};

async function openCrawlerWeb(webUrl = "https://www.google.com/") {
  try {
    driver = await new Builder()
      .forBrowser("chrome")
      .withCapabilities(options)
      .build();
    driver.get(webUrl);
  } catch (error) {
    console.log("error: chrome driver error");
  }
}

async function loginFB() {
  //注意執行順序
  await openCrawlerWeb("https://www.facebook.com/login");
  const accountEle = await driver.wait(
    until.elementLocated(By.xpath(crawlerPathMap["fb_email"]))
  );
  accountEle.sendKeys(process.env.FB_USERNAME);
  const passwordEle = await driver.wait(
    until.elementLocated(By.xpath(crawlerPathMap["fb_pass"]))
  );
  passwordEle.sendKeys(process.env.FB_PASSWORD);
  const loginBtnEle = await driver.wait(
    until.elementLocated(By.xpath(crawlerPathMap["fb_login_btn"]))
  );
  // console.log('process.env.FB_USERNAME',process.env.FB_USERNAME)
  loginBtnEle.click();

  await driver.sleep(3000);
}

async function init() {
  await loginFB();
}

init();
