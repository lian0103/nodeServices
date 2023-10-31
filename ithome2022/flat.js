const fs = require("fs-extra");
const { resolve } = require("path");

const filePath = "./articles2023.json";

async function flatJSON() {
  const file = fs.readFileSync(resolve(__dirname, filePath), "utf-8");
  const fileObject = JSON.parse(file || "{}");

  let content = [];

  Object.keys(fileObject).forEach((key) => {
    content = content.concat(fileObject[key]);
  });

  await fs.writeJson(resolve(__dirname, `./articlesFlat.json`), content);
}

flatJSON();
