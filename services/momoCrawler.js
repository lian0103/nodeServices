const cheerio = require('cheerio');
const { puppetGetWebContent } = require('./puppet');

const searchTypeMap = {
  1: '綜合排行',
  6: '銷量排行',
};

async function momoCrawler(productName = 'iphone13') {
  const startTime = new Date().getTime();

  const urlDomain = 'https://www.momoshop.com.tw';
  const searchType = '1';
  const content = await puppetGetWebContent(
    `${urlDomain}/search/searchShop.jsp?keyword=${productName}&searchType=${searchType}`
  );
  const $ = cheerio.load(content);
  const eles = $(`a[class="goodsUrl"]`);

  let arr = [];

  // 應該為 eles.length
  for (let i = 0; i < 5; i++) {
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

  await Promise.all(promiseArr);
  const endTime = new Date().getTime();
  console.log(`共花費時間:${Math.floor((endTime - startTime) / 1000)}秒`);
  // console.log(arr);
  return arr;
}

// momoCrawler('林襄');

module.exports = {
  momoCrawler,
};
