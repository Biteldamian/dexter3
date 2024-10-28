import { Database } from 'sqlite3';
import { promisify } from 'util';

class DatabaseManager {
  private db: Database;

  constructor() {
    this.db = new Database('dexter.db');
    this.init();
  }

  private async init() {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        content TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS file_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER,
        keyword TEXT,
        context TEXT,
        FOREIGN KEY (file_id) REFERENCES files (id)
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        schedule TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addFile(path: string, content: string, metadata: any) {
    const run = promisify(this.db.run.bind(this.db));
    await run(
      'INSERT OR REPLACE INTO files (path, content, metadata) VALUES (?, ?, ?)',
      [path, content, JSON.stringify(metadata)]
    );
  }

  async searchFiles(query: string) {
    const all = promisify(this.db.all.bind(this.db));
    return await all(
      `SELECT f.* FROM files f
       INNER JOIN file_index fi ON f.id = fi.file_id
       WHERE fi.keyword LIKE ? OR fi.context LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );
  }

  async updateFileIndex(fileId: number, keywords: string[], context: string) {
    const run = promisify(this.db.run.bind(this.db));
    await run('DELETE FROM file_index WHERE file_id = ?', [fileId]);
    
    for (const keyword of keywords) {
      await run(
        'INSERT INTO file_index (file_id, keyword, context) VALUES (?, ?, ?)',
        [fileId, keyword, context]
      );
    }
  }
}

export const db = new DatabaseManager();