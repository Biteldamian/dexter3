import { z } from 'zod';

const configSchema = z.object({
  app: z.object({
    name: z.string(),
    version: z.string(),
  }),
  api: z.object({
    openai: z.string().optional(),
    anthropic: z.string().optional(),
    perplexity: z.string().optional(),
  }),
  storage: z.object({
    path: z.string(),
    maxFileSize: z.number(),
    allowedFileTypes: z.array(z.string()),
  }),
  db: z.object({
    path: z.string(),
  }),
  agent: z.object({
    ollamaUrl: z.string(),
    defaultModel: z.string(),
    maxConcurrentTasks: z.number(),
  }),
  search: z.object({
    searxngUrl: z.string(),
    engines: z.array(z.string()),
  }),
  ui: z.object({
    theme: z.enum(['light', 'dark', 'cyberpunk']),
    enableAnimations: z.boolean(),
    showAgentInteractions: z.boolean(),
  }),
});

export type Config = z.infer<typeof configSchema>;

const config: Config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Dexter',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  api: {
    openai: import.meta.env.VITE_OPENAI_API_KEY,
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
    perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY,
  },
  storage: {
    path: import.meta.env.VITE_STORAGE_PATH || './storage',
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'),
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || '.txt,.md,.pdf').split(','),
  },
  db: {
    path: import.meta.env.VITE_DB_PATH || './data/dexter.db',
  },
  agent: {
    ollamaUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
    defaultModel: import.meta.env.VITE_DEFAULT_MODEL || 'llama2',
    maxConcurrentTasks: parseInt(import.meta.env.VITE_MAX_CONCURRENT_TASKS || '3'),
  },
  search: {
    searxngUrl: import.meta.env.VITE_SEARXNG_URL || 'https://searx.be',
    engines: (import.meta.env.VITE_SEARCH_ENGINES || 'google,bing,duckduckgo').split(','),
  },
  ui: {
    theme: (import.meta.env.VITE_THEME || 'cyberpunk') as Config['ui']['theme'],
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false',
    showAgentInteractions: import.meta.env.VITE_SHOW_AGENT_INTERACTIONS !== 'false',
  },
};

try {
  configSchema.parse(config);
} catch (error) {
  console.error('Configuration validation failed:', error);
  throw error;
}

export default config;