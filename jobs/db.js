const { MongoClient } = require('mongodb');

const clientMongo = new MongoClient('mongodb://localhost:27017/articles');

const connectMongo = async () => {
    await clientMongo.connect();
};

const disConnectMongo = async () => {
    await clientMongo.close();
};

module.exports = {
    clientMongo,
    connectMongo,
    disConnectMongo,
};
