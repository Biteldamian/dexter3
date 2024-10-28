import { EventEmitter } from '../utils/EventEmitter';
import logger from '../utils/logger';
import { OpenAI } from 'openai';

export class OpenAIAgent extends EventEmitter {
  private client: OpenAI | null = null;
  private initialized: boolean = false;

  constructor() {
    super();
  }

  async initialize() {
    try {
      if (this.initialized) {
        return;
      }

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }

      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      this.initialized = true;
      this.emit('initialized');
      logger.info('OpenAI agent initialized successfully');
    } catch (error) {
      logger.error('Error initializing OpenAI agent:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      if (!this.initialized) {
        return;
      }

      this.client = null;
      this.initialized = false;
      this.emit('shutdown');
      logger.info('OpenAI agent shut down successfully');
    } catch (error) {
      logger.error('Error shutting down OpenAI agent:', error);
      throw error;
    }
  }

  async generate(prompt: string, options: any = {}) {
    try {
      if (!this.initialized || !this.client) {
        throw new Error('OpenAI agent not initialized');
      }

      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
        ...options,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating response from OpenAI:', error);
      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}