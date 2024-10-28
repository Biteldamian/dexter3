import { Document } from '@langchain/core/documents';

// Define types
export interface DBDocument {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// API endpoints
const API_BASE = '/api';

export async function saveDocument(doc: Document): Promise<DBDocument> {
  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: doc.metadata.title || 'Untitled',
      content: doc.pageContent,
      metadata: doc.metadata,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save document');
  }

  return response.json();
}

export async function getDocuments(): Promise<DBDocument[]> {
  const response = await fetch(`${API_BASE}/documents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
}

export async function getDocument(id: string): Promise<DBDocument> {
  const response = await fetch(`${API_BASE}/documents/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }

  return response.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
}