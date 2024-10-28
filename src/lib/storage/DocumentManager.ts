import { promises as fs } from 'fs';
import path from 'path';
import config from '../../config';
import { db } from '../db';
import { extractMetadata } from '../metadata';
import logger from '../utils/logger';

export class DocumentManager {
  private storagePath: string;

  constructor() {
    this.storagePath = config.storage.path;
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      logger.info(`Storage initialized at ${this.storagePath}`);
    } catch (error) {
      logger.error('Error initializing storage:', error);
      throw error;
    }
  }

  async saveDocument(file: File): Promise<string> {
    try {
      if (!this.isValidFile(file)) {
        throw new Error('Invalid file type or size');
      }

      const fileName = this.generateFileName(file.name);
      const filePath = path.join(this.storagePath, fileName);
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const content = await fs.readFile(filePath, 'utf-8');
      const metadata = await extractMetadata(filePath, content);
      
      await db.addFile(fileName, content, metadata);

      logger.info(`Document saved: ${fileName}`);
      return fileName;
    } catch (error) {
      logger.error('Error saving document:', error);
      throw error;
    }
  }

  async getDocument(fileName: string): Promise<{ content: string; metadata: any }> {
    try {
      const filePath = path.join(this.storagePath, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      const metadata = await db.getFileMetadata(fileName);
      return { content, metadata };
    } catch (error) {
      logger.error(`Error retrieving document ${fileName}:`, error);
      throw error;
    }
  }

  private isValidFile(file: File): boolean {
    const isValidType = config.storage.allowedFileTypes.includes(
      path.extname(file.name).toLowerCase()
    );
    const isValidSize = file.size <= config.storage.maxFileSize;
    return isValidType && isValidSize;
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    return `${baseName}-${timestamp}${extension}`;
  }
}