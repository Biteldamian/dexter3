import { EventEmitter } from '../utils/EventEmitter';
import logger from '../utils/logger';

export class PerplexityAgent extends EventEmitter {
  private initialized: boolean = false;

  constructor() {
    super();
  }

  async initialize() {
    try {
      if (this.initialized) {
        return;
      }

      const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
      if (!apiKey) {
        throw new Error('Perplexity API key not found');
      }

      this.initialized = true;
      this.emit('initialized');
      logger.info('Perplexity agent initialized successfully');
    } catch (error) {
      logger.error('Error initializing Perplexity agent:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      if (!this.initialized) {
        return;
      }

      this.initialized = false;
      this.emit('shutdown');
      logger.info('Perplexity agent shut down successfully');
    } catch (error) {
      logger.error('Error shutting down Perplexity agent:', error);
      throw error;
    }
  }

  async generate(prompt: string, options: any = {}) {
    try {
      if (!this.initialized) {
        throw new Error('Perplexity agent not initialized');
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from Perplexity');
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating response from Perplexity:', error);
      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}