import pg from "pg";
import fs from "fs";
import path from "path";
import env from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

env.config();  // Load environment variables

const db = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Function to run the schema.sql file
const runSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schema);
    console.log("Database schema initialized successfully.");
  } catch (err) {
    console.error("Error running schema.sql:", err);
  }
};

// Run the schema when the app starts
runSchema();


export default db;
