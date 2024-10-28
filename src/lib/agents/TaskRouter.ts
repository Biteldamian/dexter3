import { TaskAssessment, AgentType } from '../types';

export class TaskRouter {
  private agentCapabilities: Map<AgentType, string[]>;

  constructor() {
    this.agentCapabilities = new Map([
      ['ollama', ['general', 'coordination', 'synthesis']],
      ['openai', ['coding', 'analysis', 'creativity']],
      ['anthropic', ['research', 'writing', 'reasoning']],
      ['perplexity', ['search', 'factual-verification', 'current-events']]
    ]);
  }

  public routeTask(assessment: TaskAssessment): AgentType[] {
    const selectedAgents: AgentType[] = [];
    const requiredCapabilities = new Set(assessment.required_capabilities);

    // Always include coordinator for complex tasks
    if (assessment.complexity > 5) {
      selectedAgents.push('ollama');
    }

    // Match capabilities with agents
    this.agentCapabilities.forEach((capabilities, agentType) => {
      if (capabilities.some(cap => requiredCapabilities.has(cap))) {
        selectedAgents.push(agentType);
      }
    });

    // Ensure at least one agent is selected
    if (selectedAgents.length === 0) {
      selectedAgents.push('ollama');
    }

    return selectedAgents;
  }
}