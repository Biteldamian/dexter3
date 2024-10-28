import express from 'express';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database(path.join(__dirname, '../data/dexter.db'));

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());

// API Routes
app.post('/api/documents', (req, res) => {
  const { title, content, metadata } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO documents (id, title, content, metadata) VALUES (?, ?, ?, ?)',
    [id, title, content, JSON.stringify(metadata)],
    (err) => {
      if (err) {
        console.error('Error saving document:', err);
        return res.status(500).json({ error: 'Failed to save document' });
      }
      
      res.status(201).json({
        id,
        title,
        content,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  );
});

app.get('/api/documents', (req, res) => {
  db.all('SELECT * FROM documents ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching documents:', err);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
    
    const documents = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
    
    res.json(documents);
  });
});

app.get('/api/documents/:id', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching document:', err);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({
      id: row.id,
      title: row.title,
      content: row.content,
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  });
});

app.delete('/api/documents/:id', (req, res) => {
  db.run('DELETE FROM documents WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting document:', err);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
    
    res.status(204).send();
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});