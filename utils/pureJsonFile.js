const fs = require('fs-extra');
const { resolve } = require('path');

const pureTopicString = (str) => {
  return '' + str.split('\n')[0];
};

const pureString = (str) => {
  return str.replace('/\n/g', '').replace('/  系列/g', '').trim();
};

function sortDataByDate() {
  const file = fs.readFileSync(
    resolve(__dirname, '../ithome2022/articles.json'),
    'utf-8'
  );
  let fileObject = JSON.parse(file);
  Object.keys(fileObject).forEach((key) => {
    fileObject[key] = fileObject[key].sort((pre, next) => {
      return (
        new Date(pre.updateTime).getTime() - new Date(next.updateTime).getTime()
      );
    });
  });
  fs.outputFile(
    resolve(__dirname, '../ithome2022/articles.json'),
    JSON.stringify(fileObject),
    (err) => {
      if (err) console.log(err);
    }
  );
}

module.exports = { pureString, pureTopicString, sortDataByDate };

// const file = fs.readFileSync(
//   resolve(__dirname, '../ithome2022/articles.json'),
//   'utf-8'
// );
// let fileObject = JSON.parse(file);

// Object.keys(fileObject).forEach((key) => {
//   fileObject[key].forEach((item) => {
//     item.topic = pureTopicString(item.topic);
//   });
// });

// fs.outputFile(
//   resolve(__dirname, '../ithome2022/articles.json'),
//   JSON.stringify(fileObject),
//   (err) => {
//     if (err) console.log(err);
//   }
// );
