const { connectToDb, getDb } = require('./db');

connectToDb(async () => {
  const db = getDb();
  let page = 1;
  let perPageLength = 5;
  let content = [];
  content = await db
    .collection('itHome')
    .find({title:{$regex:/vue|前端|vite/i}})
    .sort({ author: 1 })
    .skip((page-1) * perPageLength)
    .limit(perPageLength)
    .toArray();

  console.log(content);
});
