import { BaseAgent } from './BaseAgent';
import { Task, AgentResponse } from '../types';
import { Document } from '@langchain/core/documents';
import { ChatOpenAI } from '@langchain/openai';
import { searchSearxng } from '../search/searxng';

export class ResearchAgent extends BaseAgent {
  private llm: ChatOpenAI;
  private searchAgent: BaseAgent;

  constructor(llm: ChatOpenAI, searchAgent: BaseAgent) {
    super('ResearchAgent', ['research', 'analysis', 'synthesis']);
    this.llm = llm;
    this.searchAgent = searchAgent;
  }

  async processTask(task: Task): Promise<AgentResponse> {
    try {
      // First, get search results
      const searchResponse = await this.searchAgent.processTask(task);
      const documents = JSON.parse(searchResponse.content) as Document[];

      // Analyze and synthesize information
      const analysis = await this.llm.invoke([{
        role: 'system',
        content: `Analyze and synthesize the following information to answer the question: ${task.description}`
      }, {
        role: 'user',
        content: documents.map(doc => doc.pageContent).join('\n\n')
      }]);

      const response: AgentResponse = {
        agentType: 'research',
        content: analysis.content,
        confidence: this.calculateConfidence({ searchResults: documents, analysis }),
        metadata: {
          sources: documents.map(doc => doc.metadata.url),
          timestamp: new Date()
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
    await this.searchAgent.shutdown();
  }

  protected calculateConfidence(data: any): number {
    const searchConfidence = Math.min(data.searchResults.length / 5, 1);
    const analysisConfidence = data.analysis ? 0.9 : 0.5;
    return (searchConfidence + analysisConfidence) / 2;
  }
}