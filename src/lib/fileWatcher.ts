import chokidar from 'chokidar';
import { readFile } from 'fs/promises';
import { extname } from 'path';
import { db } from './db';
import { extractMetadata } from './metadata';

export class FileWatcher {
  private watcher: chokidar.FSWatcher;
  
  constructor(watchPath: string) {
    this.watcher = chokidar.watch(watchPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    this.initializeWatcher();
  }

  private initializeWatcher() {
    this.watcher
      .on('add', this.handleFileAdd.bind(this))
      .on('change', this.handleFileChange.bind(this))
      .on('unlink', this.handleFileDelete.bind(this));
  }

  private async handleFileAdd(path: string) {
    try {
      const content = await readFile(path, 'utf-8');
      const metadata = await extractMetadata(path, content);
      await db.addFile(path, content, metadata);
    } catch (error) {
      console.error(`Error processing file ${path}:`, error);
    }
  }

  private async handleFileChange(path: string) {
    await this.handleFileAdd(path);
  }

  private async handleFileDelete(path: string) {
    // Implement file deletion logic
  }

  public close() {
    this.watcher.close();
  }
}