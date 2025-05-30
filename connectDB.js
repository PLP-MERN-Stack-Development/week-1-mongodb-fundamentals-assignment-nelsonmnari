const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const dbName = "plp_bookstore";

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("books");
  return { client, collection };
}

module.exports = connectDB;
