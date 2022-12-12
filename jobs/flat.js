const fs = require('fs-extra');
const { resolve } = require('path');

async function flatJSON() {
    const file = fs.readFileSync(resolve(__dirname, './data.json'), 'utf-8');
    const fileObject = JSON.parse(file || '{}');

    let content = [];

    Object.keys(fileObject).forEach((key) => {
        content = content.concat(fileObject[key]);
    });

    await fs.writeJson(resolve(__dirname, `./dataFlat.json`), content);

    return true;
}

module.exports = { flatJSON };
