import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSpace } from './index.js';

// Create __dirname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/create-meet', async (req, res) => {
  try {
    const meetLink = await createSpace();
    res.json({ meetLink });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Google Meet link' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
