import { Database } from 'sqlite3';
import { KnowledgeEntry, Task } from '../types';

export class KnowledgeBase {
  private db: Database;

  constructor() {
    this.db = new Database('knowledge.db');
    this.initialize();
  }

  private async initialize() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS knowledge_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        responses TEXT NOT NULL,
        synthesized_result TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT
      )
    `);
  }

  public async addEntry(entry: KnowledgeEntry): Promise<void> {
    const { task, responses, synthesizedResult, timestamp } = entry;
    
    await this.db.run(
      `INSERT INTO knowledge_entries (task, responses, synthesized_result, timestamp)
       VALUES (?, ?, ?, ?)`,
      [
        JSON.stringify(task),
        JSON.stringify(responses),
        JSON.stringify(synthesizedResult),
        timestamp.toISOString()
      ]
    );
  }

  public async findSimilarTasks(task: Task): Promise<KnowledgeEntry[]> {
    // Implement semantic search for similar tasks
    return [];
  }

  public async getRecentEntries(limit: number = 10): Promise<KnowledgeEntry[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM knowledge_entries ORDER BY timestamp DESC LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows.map(row => ({
            task: JSON.parse(row.task),
            responses: JSON.parse(row.responses),
            synthesizedResult: JSON.parse(row.synthesized_result),
            timestamp: new Date(row.timestamp)
          })));
        }
      );
    });
  }
}