import express from 'express';
import { db } from './db';
import multer from 'multer';
import { extractMetadata } from './metadata';
import { readFile } from 'fs/promises';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// File operations
router.post('/files', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const content = await readFile(file.path, 'utf-8');
    const metadata = await extractMetadata(file.path, content);
    await db.addFile(file.originalname, content, metadata);

    res.json({ message: 'File uploaded successfully', metadata });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
});

router.get('/files/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await db.searchFiles(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error searching files' });
  }
});

// Task operations
router.post('/tasks', async (req, res) => {
  try {
    const { name, schedule } = req.body;
    // Implement task creation
    res.json({ message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

export const apiRouter = router;