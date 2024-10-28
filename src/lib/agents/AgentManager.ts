import { EventEmitter } from '../utils/EventEmitter';
import { OllamaAgent } from './OllamaAgent';
import { OpenAIAgent } from './OpenAIAgent';
import { AnthropicAgent } from './AnthropicAgent';
import { PerplexityAgent } from './PerplexityAgent';
import logger from '../utils/logger';

export class AgentManager extends EventEmitter {
  private agents: Map<string, any> = new Map();
  private initialized: boolean = false;

  constructor() {
    super();
    this.initializeAgents = this.initializeAgents.bind(this);
    this.shutdown = this.shutdown.bind(this);
  }

  async initializeAgents() {
    try {
      if (this.initialized) {
        return;
      }

      const ollamaAgent = new OllamaAgent();
      const openAIAgent = new OpenAIAgent();
      const anthropicAgent = new AnthropicAgent();
      const perplexityAgent = new PerplexityAgent();

      await Promise.all([
        ollamaAgent.initialize(),
        openAIAgent.initialize(),
        anthropicAgent.initialize(),
        perplexityAgent.initialize()
      ]);

      this.agents.set('ollama', ollamaAgent);
      this.agents.set('openai', openAIAgent);
      this.agents.set('anthropic', anthropicAgent);
      this.agents.set('perplexity', perplexityAgent);

      this.initialized = true;
      this.emit('initialized');
      logger.info('All agents initialized successfully');
    } catch (error) {
      logger.error('Error initializing agents:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      const shutdownPromises = Array.from(this.agents.entries()).map(async ([name, agent]) => {
        try {
          await agent.shutdown();
          logger.info(`Agent ${name} shut down successfully`);
        } catch (error) {
          logger.error(`Error shutting down agent ${name}:`, error);
        }
      });

      await Promise.all(shutdownPromises);
      this.agents.clear();
      this.initialized = false;
      this.emit('shutdown');
      logger.info('All agents shut down successfully');
    } catch (error) {
      logger.error('Error during shutdown:', error);
      throw error;
    }
  }

  getAgent(name: string) {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    return agent;
  }

  isInitialized() {
    return this.initialized;
  }
}

export const agentManager = new AgentManager();