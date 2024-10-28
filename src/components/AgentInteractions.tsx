import React, { useEffect, useRef } from 'react';
import { useAgentStore } from '../stores/agentStore';
import { MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'agent' | 'user' | 'system';
  content: string;
  agent?: string;
  timestamp: Date;
}

const AgentInteractions: React.FC = () => {
  const { messages, clearMessages } = useAgentStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message: Message) => {
    const isAgent = message.type === 'agent';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex items-start space-x-3 p-4 ${
          isAgent ? 'bg-indigo-50' : isSystem ? 'bg-gray-50' : 'bg-white'
        }`}
      >
        <div className="flex-shrink-0">
          {isAgent ? (
            <Bot className="h-6 w-6 text-indigo-600" />
          ) : isSystem ? (
            <MessageCircle className="h-6 w-6 text-gray-600" />
          ) : (
            <User className="h-6 w-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {isAgent ? message.agent : isSystem ? 'System' : 'User'}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Agent Interactions</h2>
        <button
          onClick={clearMessages}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default AgentInteractions;