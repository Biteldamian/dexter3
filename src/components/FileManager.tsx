import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { File, Search, Upload, Trash2 } from 'lucide-react';
import { Document } from '@langchain/core/documents';
import { saveDocument, getDocuments, deleteDocument, DBDocument } from '../lib/api/database';

const FileManager: React.FC = () => {
  const [documents, setDocuments] = useState<DBDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        const content = await file.text();
        const doc = new Document({
          pageContent: content,
          metadata: {
            title: file.name,
            type: file.type,
            size: file.size,
          },
        });
        await saveDocument(doc);
      }
      loadDocuments();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  }, [loadDocuments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'application/pdf': ['.pdf'],
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">File Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        {isUploading && (
          <p className="mt-2 text-sm text-indigo-600">Uploading files...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((doc) => (
            <li key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <File className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileManager;