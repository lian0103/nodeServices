const cheerio = require('cheerio');
const { puppetGetWebContentWithUserArgs } = require('./puppet');
const fs = require('fs-extra');
const { resolve } = require('path');

const pureString = (str) => {
  return str.replaceAll('\n', '').replaceAll('  系列', '').trim();
};

async function writeFiles(dataArr = []) {
  const file = fs.readFileSync(
    resolve(__dirname, '../ithome2022/articles.json'),
    'utf-8'
  );
  //   console.log(JSON.parse(file));
  let fileObject = JSON.parse(file);

  dataArr.forEach((data) => {
    let { author } = data;
    if (!fileObject[author]) {
      fileObject[author] = [data];
    } else if (Array.isArray(fileObject[author])) {
      let set = new Set();
      let arr = [...fileObject[author], data];
      fileObject[author] = arr.filter((item) =>
        !set.has(item.title) ? set.add(item.title) : false
      );
    }
  });

  fs.outputFile(
    resolve(__dirname, '../ithome2022/articles.json'),
    JSON.stringify(fileObject),
    (err) => {
      if (err) console.log(err);
    }
  );
}

async function crawler() {
  const startTime = new Date().getTime();

  const url = 'https://ithelp.ithome.com.tw/2022ironman/web';

  const content = await puppetGetWebContentWithUserArgs(url);
  const $ = cheerio.load(content);
  const eles = $('span[class="pagination-inner"] a');

  let arr = [];
  for (let i = 0; i < eles.length; i++) {
    arr.push(eles.eq(i).text());
  }

  let pageTotal = arr[arr.length - 1];

  for (let i = 0; i < pageTotal; i++) {
    const pageStartTime = new Date().getTime();

    let perPageContent = await puppetGetWebContentWithUserArgs(
      `${url}?page=${i + 1}`
    );
    let $page = cheerio.load(perPageContent);
    let pageEles = $page('div[class="articles-box"]');

    // console.log(pageEles.length);
    let dataArr = [];

    for (j = 0; j < pageEles.length; j++) {
      let data = {
        author: pureString(pageEles.eq(j).find('.ir-list__name').text()),
        topic: pureString(pageEles.eq(j).find('.articles-topic').text()),
        title: pureString(pageEles.eq(j).find('.articles-title').text()),
        href: pageEles.eq(j).find('.articles-title').find('a').attr('href'),
        updateTime: pureString(pageEles.eq(j).find('.date').text()),
      };
      dataArr.push(data);
    }

    console.log(dataArr);

    await writeFiles(dataArr);

    const pageEndTime = new Date().getTime();
    console.log(
      `page${i + 1}花費時間:${Math.floor(
        (pageEndTime - pageStartTime) / 1000
      )}秒`
    );
  }

  const endTime = new Date().getTime();
  console.log(
    `${pageTotal} pages 共花費時間:${Math.floor(
      (endTime - startTime) / 1000
    )}秒`
  );
}

crawler();
