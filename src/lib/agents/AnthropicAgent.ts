import { EventEmitter } from '../utils/EventEmitter';
import logger from '../utils/logger';
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicAgent extends EventEmitter {
  private client: Anthropic | null = null;
  private initialized: boolean = false;

  constructor() {
    super();
  }

  async initialize() {
    try {
      if (this.initialized) {
        return;
      }

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('Anthropic API key not found');
      }

      this.client = new Anthropic({
        apiKey
      });

      this.initialized = true;
      this.emit('initialized');
      logger.info('Anthropic agent initialized successfully');
    } catch (error) {
      logger.error('Error initializing Anthropic agent:', error);
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
      logger.info('Anthropic agent shut down successfully');
    } catch (error) {
      logger.error('Error shutting down Anthropic agent:', error);
      throw error;
    }
  }

  async generate(prompt: string, options: any = {}) {
    try {
      if (!this.initialized || !this.client) {
        throw new Error('Anthropic agent not initialized');
      }

      const message = await this.client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        ...options,
      });

      return message.content[0].text;
    } catch (error) {
      logger.error('Error generating response from Anthropic:', error);
      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}