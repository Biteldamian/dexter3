import { PythonShell } from 'python-shell';
import { join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import { db } from './db';

export class Orchestrator {
  private pythonPath: string;
  private modelConfig: {
    orchestrator: string;
    subAgent: string;
    refiner: string;
  };

  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python3';
    this.modelConfig = {
      orchestrator: process.env.ORCHESTRATOR_MODEL || 'llama3:70b-instruct',
      subAgent: process.env.SUBAGENT_MODEL || 'llama3:instruct',
      refiner: process.env.REFINER_MODEL || 'llama3:70b-instruct'
    };

    // Ensure the maestro directory exists
    mkdirSync('./maestro', { recursive: true });
    this.initializeMaestro();
  }

  private initializeMaestro() {
    // Create a simplified version of maestro.py for our needs
    const maestroScript = `
import os
import json
from datetime import datetime
import ollama

ORCHESTRATOR_MODEL = '${this.modelConfig.orchestrator}'
SUBAGENT_MODEL = '${this.modelConfig.subAgent}'
REFINER_MODEL = '${this.modelConfig.refiner}'

def process_task(objective, context=None):
    # Initialize Ollama client
    client = ollama.Client(host='http://localhost:11434')
    
    # Break down task using orchestrator
    orchestrator_response = client.chat(
        model=ORCHESTRATOR_MODEL,
        messages=[{
            "role": "user",
            "content": f"Objective: {objective}\\nContext: {context if context else 'None'}"
        }]
    )
    
    subtasks = orchestrator_response['message']['content']
    
    # Process subtasks using subagent
    results = []
    for subtask in subtasks.split('\\n'):
        if subtask.strip():
            subagent_response = client.chat(
                model=SUBAGENT_MODEL,
                messages=[{"role": "user", "content": subtask}]
            )
            results.append({
                "task": subtask,
                "result": subagent_response['message']['content']
            })
    
    # Refine results
    refiner_response = client.chat(
        model=REFINER_MODEL,
        messages=[{
            "role": "user",
            "content": f"Objective: {objective}\\nResults: {json.dumps(results)}"
        }]
    )
    
    return {
        "objective": objective,
        "subtasks": results,
        "final_output": refiner_response['message']['content']
    }

if __name__ == "__main__":
    import sys
    objective = sys.argv[1]
    context = sys.argv[2] if len(sys.argv) > 2 else None
    result = process_task(objective, context)
    print(json.dumps(result))
    `;

    writeFileSync('./maestro/maestro.py', maestroScript);
  }

  async processTask(objective: string, context?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonPath: this.pythonPath,
        pythonOptions: ['-u'],
        scriptPath: './maestro',
        args: [objective, context].filter(Boolean)
      };

      PythonShell.run('maestro.py', options).then(messages => {
        const result = JSON.parse(messages[messages.length - 1]);
        resolve(result);
      }).catch(reject);
    });
  }

  async executeTask(task: string, context?: string) {
    try {
      const result = await this.processTask(task, context);
      
      // Store results in database
      await db.addTaskResult(task, result);
      
      return result;
    } catch (error) {
      console.error('Error executing task:', error);
      throw error;
    }
  }
}