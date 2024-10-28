import React, { useState } from 'react';
import { Brain, FileText, Terminal, Settings as SettingsIcon } from 'lucide-react';
import FileManager from './components/FileManager';
import KnowledgeBase from './components/KnowledgeBase';
import TaskOrchestrator from './components/TaskOrchestrator';
import SettingsPanel from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('files');
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dexter</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-1">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
                activeTab === 'files' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Files</span>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
                activeTab === 'knowledge' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Brain className="h-5 w-5" />
              <span>Knowledge Base</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
                activeTab === 'tasks' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Terminal className="h-5 w-5" />
              <span>Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg ${
                activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === 'files' && <FileManager />}
            {activeTab === 'knowledge' && <KnowledgeBase data={knowledgeBase} />}
            {activeTab === 'tasks' && <TaskOrchestrator tasks={tasks} setTasks={setTasks} />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;