import express from "express";
import bodyParser from "body-parser";
import db from "./db.js";  // Importing the database functions
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
//    ***** functions  ********* //
const insertUser = async (email, password) => {
  const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
  const values = [email, password];
   
  try {
    const res = await db.query(query, values);
    console.log('User inserted:', res.rows[0]);
    return res; // Return the result for further processing
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err; // Rethrow the error to handle it in the calling function
  }
};

//  ********** get requests ********** //
app.get('/api', (req, res) => {
  res.json('hello');
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Insert user into the database using the insertUser function
    const result = await insertUser(email, password);

    // Respond with the newly inserted user row
    console.log(result.rows[0]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', success: false });
  }
});


app.listen(port, () => {
  console.log(`server running on ${port}`);
});
