const { connectToDb, getDb } = require('./db');

const agg = [
  {
    $match: {
      title: {
        $regex: /vue|前端|vite/i,
      },
    },
  },
  {
    $sort: {
      updateTime: -1,
    },
  },
];

connectToDb(async () => {
  const db = getDb();
  let cursor = db.collection('itHome').aggregate(agg);
  const result = await cursor.toArray();

  console.log(result.length);
});
