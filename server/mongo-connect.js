import {MongoClient} from "mongodb";

import env from "dotenv";

env.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectToDB() {
  try {
  await client.connect();
  const db = client.db("mydb");
  console.log("connected to mongoDB Atlas");
  
  return db;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export default connectToDB;