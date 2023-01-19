const { MongoClient } = require('mongodb');

const clientMongo = new MongoClient(process.env.MOMGO_URL);

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
