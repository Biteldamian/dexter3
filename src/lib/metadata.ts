import { extname } from 'path';
import { stat } from 'fs/promises';

export async function extractMetadata(path: string, content: string) {
  const stats = await stat(path);
  const extension = extname(path).toLowerCase();

  const metadata: any = {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    extension,
  };

  // Extract additional metadata based on file type
  switch (extension) {
    case '.md':
      metadata.title = extractMarkdownTitle(content);
      metadata.wordCount = countWords(content);
      break;
    case '.json':
      metadata.keys = Object.keys(JSON.parse(content));
      break;
    // Add more file type handlers as needed
  }

  return metadata;
}

function extractMarkdownTitle(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : '';
}

function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}