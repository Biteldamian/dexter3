import { EventEmitter } from 'events';
import { Task, AgentResponse } from '../types';

export abstract class BaseAgent extends EventEmitter {
  protected name: string;
  protected capabilities: string[];

  constructor(name: string, capabilities: string[] = []) {
    super();
    this.name = name;
    this.capabilities = capabilities;
  }

  abstract processTask(task: Task): Promise<AgentResponse>;
  abstract shutdown(): Promise<void>;

  public getCapabilities(): string[] {
    return this.capabilities;
  }

  protected calculateConfidence(response: any): number {
    // Base confidence calculation - override in specific agents
    return 0.8;
  }

  protected emitResponse(response: AgentResponse) {
    this.emit('response', response);
  }

  protected emitError(error: Error) {
    this.emit('error', error);
  }
}