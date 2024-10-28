import { BaseAgent } from './BaseAgent';
import { Task, AgentResponse } from '../types';
import { searchSearxng } from '../search/searxng';
import { Document } from '@langchain/core/documents';

export class SearchAgent extends BaseAgent {
  private engines: string[];

  constructor(engines: string[] = ['google', 'bing', 'duckduckgo']) {
    super('SearchAgent', ['web-search', 'information-retrieval']);
    this.engines = engines;
  }

  async processTask(task: Task): Promise<AgentResponse> {
    try {
      const results = await searchSearxng(task.description, {
        engines: this.engines,
        language: 'en'
      });

      const documents = results.results.map(result => 
        new Document({
          pageContent: result.content,
          metadata: {
            title: result.title,
            url: result.url,
            ...(result.img_src && { img_src: result.img_src })
          }
        })
      );

      const response: AgentResponse = {
        agentType: 'search',
        content: JSON.stringify(documents),
        confidence: this.calculateConfidence(results),
        metadata: {
          engine: this.engines.join(','),
          timestamp: new Date(),
          resultCount: documents.length
        }
      };

      this.emitResponse(response);
      return response;
    } catch (error) {
      this.emitError(error as Error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    // No cleanup needed
  }

  protected calculateConfidence(results: any): number {
    return Math.min(results.results.length / 10, 1);
  }
}