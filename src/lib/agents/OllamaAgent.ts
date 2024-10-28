import { EventEmitter } from '../utils/EventEmitter';
import logger from '../utils/logger';

export class OllamaAgent extends EventEmitter {
  private client: any = null;
  private model: string = 'llama2';
  private initialized: boolean = false;

  constructor() {
    super();
  }

  async initialize() {
    try {
      if (this.initialized) {
        return;
      }

      // Initialize Ollama client
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) {
        throw new Error('Failed to connect to Ollama service');
      }

      this.initialized = true;
      this.emit('initialized');
      logger.info('Ollama agent initialized successfully');
    } catch (error) {
      logger.error('Error initializing Ollama agent:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      if (!this.initialized) {
        return;
      }

      // Cleanup any active connections or resources
      this.client = null;
      this.initialized = false;
      this.emit('shutdown');
      logger.info('Ollama agent shut down successfully');
    } catch (error) {
      logger.error('Error shutting down Ollama agent:', error);
      throw error;
    }
  }

  async generate(prompt: string, options: any = {}) {
    try {
      if (!this.initialized) {
        throw new Error('Ollama agent not initialized');
      }

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from Ollama');
      }

      const result = await response.json();
      return result.response;
    } catch (error) {
      logger.error('Error generating response from Ollama:', error);
      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}