import React, { useState } from 'react';
import { Search, Book } from 'lucide-react';

const KnowledgeBase = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Book className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-gray-600">{item.content}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Last updated: {item.updatedAt}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">Source: {item.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;