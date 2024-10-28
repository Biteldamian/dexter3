export type AgentType = 'ollama' | 'openai' | 'anthropic' | 'perplexity';

export interface Task {
  id: string;
  description: string;
  priority: number;
  context?: any;
  requirements?: string[];
}

export interface AgentResponse {
  agentType: AgentType;
  content: string;
  confidence: number;
  metadata: {
    [key: string]: any;
  };
}

export interface TaskAssessment {
  complexity: number;
  required_capabilities: string[];
  suggested_agents: AgentType[];
  execution_strategy: string;
}

export interface KnowledgeEntry {
  task: Task;
  responses: AgentResponse[];
  synthesizedResult: AgentResponse;
  timestamp: Date;
}