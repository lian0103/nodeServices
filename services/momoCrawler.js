const cheerio = require('cheerio');
const { puppetGetWebContent } = require('./puppet');
const dayjs = require('dayjs');
const {
  initGoogle,
  appendSheet,
  addSheet,
  getSheetsInfo,
  updateSheetProperties,
} = require('./googleSheets');

const searchTypeMap = {
  1: '綜合排行',
  6: '銷量排行',
};

async function momoCrawler(keyword = 'apple iphone13', crawlerNum = 5) {
  const startTime = new Date().getTime();

  const urlDomain = 'https://www.momoshop.com.tw';
  const searchType = '6';
  const content = await puppetGetWebContent(
    `${urlDomain}/search/searchShop.jsp?keyword=${keyword}&searchType=${searchType}`
  );
  const $ = cheerio.load(content);
  const eles = $(`a[class="goodsUrl"]`);

  let arr = [];
  for (let i = 0; i < crawlerNum; i++) {
    arr.push({
      name: eles.eq(i).find('.prdName').text(),
      url: urlDomain + eles.eq(i).attr('href'),
      img: eles.eq(i).find('img')?.attr('src') || '',
    });
  }
  arr = arr.filter((item) => item.name != '' && item.img != '');

  // console.log(arr);

  let promiseArr = [];

  arr.forEach(async (item, idx) => {
    promiseArr.push(
      new Promise(async (resolv, reject) => {
        const goodContent = await puppetGetWebContent(item.url);
        const $good = await cheerio.load(goodContent);
        const tagEles = $good(`*[class="FBGO"]`);
        let tags = [];
        for (let i = 0; i < tagEles.length; i++) {
          if (tagEles.eq(i).text()) {
            tags.push(tagEles.eq(i).text());
          }
        }
        arr[idx].tags = tags;

        const priceEles = $good(`*[class="special"]`);
        arr[idx].price = priceEles.eq(0).find('span').text();

        arr[idx].searchType = searchTypeMap[searchType];

        resolv(true);
      })
    );
  });

  // console.log(arr);
  return new Promise((resolv, reject) => {
    Promise.all(promiseArr)
      .then(() => {
        const endTime = new Date().getTime();
        console.log(
          `${keyword} 共花費時間:${Math.floor((endTime - startTime) / 1000)}秒`
        );
        resolv(arr);
      })
      .catch((err) => {
        console.log('momoCrawler error', error);
      });
  });
}

async function momoCrawlerImplement(targetArr = []) {
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


// const targetArr = [
//   { brand: 'apple', productName: 'megsafe' },
//   { brand: '', productName: '美國牛' },
//   { brand: '郭元益', productName: '鳳梨酥' },
// ];

// momoCrawlerImplement(targetArr);


module.exports = {
  momoCrawlerImplement,
};
