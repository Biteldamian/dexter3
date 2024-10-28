import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  type: 'agent' | 'user' | 'system';
  content: string;
  agent?: string;
  timestamp: Date;
}

interface AgentStore {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: uuidv4(),
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));