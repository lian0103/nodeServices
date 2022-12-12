const { clientMongo, connectMongo, disConnectMongo } = require('./db');
const fs = require('fs-extra');
const { resolve } = require('path');
const dayjs = require('dayjs');

async function writeToDB() {
    await connectMongo();
    const file = fs.readFileSync(resolve(__dirname, './data.json'), 'utf-8');
    const fileObject = JSON.parse(file || '{}');
    const promiseArr = [];
    const dataArrForDB = Object.keys(fileObject).map((key) => fileObject[key]) || [];
    dataArrForDB.forEach(async (item) => {
        // console.log(item);
        if (item?.catchdDate === dayjs().format('YYYY-MM-DD')) {
            promiseArr.push(
                new Promise(async (resolve, reject) => {
                    let arr = await clientMongo.db('articles').collection('jobs').find({ _id: item._id }).toArray();
                    if (arr.length == 0) {
                        await clientMongo.db('articles').collection('jobs').insertOne(item);
                        resolve(true);
                    }
                })
            );
        }
    });
    await Promise.all(promiseArr);
    await disConnectMongo();
}

module.exports = {
    writeToDB,
};

writeToDB();
