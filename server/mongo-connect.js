// const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
import env from "dotenv";
// Replace the uri string with your MongoDB deployment's connection string.

env.config();
var uri = process.env.MONGO_URL ;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    // database and collection code goes here
   
const db = client.db("sample_guides");
const coll = db.collection("planets");

const cursor = coll.find(
 { orderFromSun: { $gt: 2 } }, { orderFromSun: { $lt: 5 } 
});

// iterate code goes here
await cursor.forEach(console.log);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
