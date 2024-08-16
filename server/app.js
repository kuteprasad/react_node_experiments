import express from 'express';
import cors from 'cors';

import connectToDB from './mongo-connect.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

(async ()=> {
  try {
    
    db = await connectToDB();
    console.log("Connected to MongoDB successfully");
    
  } catch (error) {
    console.error("failed to connect" ,error);
    process.exit(1);
  }
} )();

app.post('/api/login', async (req, res) => {

    const info = req.body;
    console.log("reached app.js --->>>>>" );
    console.log(info);
    
    
    try {
      const data =  await db.collection('users').insertOne(info);
      
      res.json({status: data.acknowledged});
    } catch (error) {
      console.log(error);
      res.status(500).json({status: false, error: "Effor occurred while inserting data"});
    }
   

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// handle server shutdown

process.on('SIGINT', async () => {
  console.log("Closing MongoDB Connection");
  if (db && db.client) {
    await db.client.close();
  }
  process.exit(0);
});