import React, { useEffect, useState } from 'react';
import { Play, Plus, XCircle } from 'lucide-react';
import { agentManager } from '../lib/agents/AgentManager';
import { useAgentStore } from '../stores/agentStore';
import logger from '../lib/utils/logger';

interface Task {
  id: number;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskOrchestrator: React.FC<Props> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const addMessage = useAgentStore((state) => state.addMessage);

  useEffect(() => {
    const initializeAgents = async () => {
      try {
        await agentManager.initializeAgents();
        addMessage({
          type: 'system',
          content: 'All agents initialized successfully',
        });
      } catch (error) {
        logger.error('Error initializing agents:', error);
        addMessage({
          type: 'system',
          content: 'Failed to initialize agents',
        });
      }
    };

    initializeAgents();

    return () => {
      agentManager.shutdown().catch((error) => {
        logger.error('Error shutting down agents:', error);
      });
    };
  }, [addMessage]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        description: newTask,
        status: 'pending' as const,
      };
      setTasks((prev) => [...prev, task]);
      setNewTask('');
      addMessage({
        type: 'system',
        content: `New task added: ${newTask}`,
      });
    }
  };

  const handleExecuteTask = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'running' } : t
      )
    );

    try {
      addMessage({
        type: 'system',
        content: `Executing task: ${task.description}`,
      });

      const ollamaAgent = agentManager.getAgent('ollama');
      const response = await ollamaAgent.generate(task.description);

      addMessage({
        type: 'agent',
        content: response,
        agent: 'Ollama',
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: 'completed' } : t
        )
      );
    } catch (error) {
      logger.error('Error executing task:', error);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: 'failed' } : t
        )
      );
      addMessage({
        type: 'system',
        content: `Failed to execute task: ${task.description}`,
      });
    }
  };

  const handleRemoveTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    addMessage({
      type: 'system',
      content: 'Task removed',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Task Orchestration</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="New task..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button
            onClick={handleAddTask}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${
              task.status === 'running' ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <span
                className={`w-3 h-3 rounded-full ${
                  task.status === 'completed'
                    ? 'bg-green-500'
                    : task.status === 'failed'
                    ? 'bg-red-500'
                    : task.status === 'running'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
              />
              <span className="text-gray-900">{task.description}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExecuteTask(task.id)}
                className="p-2 text-indigo-600 hover:text-indigo-700"
                disabled={task.status === 'running'}
              >
                <Play className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskOrchestrator;