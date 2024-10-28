# Dexter - AI-Powered File Management & Reasoning Assistant

Dexter is an intelligent system that combines local LLMs (via Ollama) with cloud AI services to provide powerful file management, research, and task orchestration capabilities. It features a modern web interface and a multi-agent architecture for sophisticated AI operations.

![Dexter Interface](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000)

## Features

### Core Capabilities
- 🤖 **Multi-Agent Architecture**: Orchestrates multiple AI models (Ollama, OpenAI, Anthropic, Perplexity)
- 📁 **Smart File Management**: Indexes and organizes files with metadata extraction
- 🔍 **Advanced Search**: Full-text and semantic search across documents
- 🧠 **Knowledge Base**: Builds and maintains a searchable knowledge repository
- 🎯 **Task Orchestration**: Executes AI-powered tasks using multiple agents

### Agent System
- **Coordinator Agent**: Ollama-based central orchestrator
- **Specialized Agents**: OpenAI, Anthropic, and Perplexity for specific tasks
- **Task Router**: Intelligent task delegation based on agent capabilities
- **Knowledge Aggregation**: Combines insights from multiple agents

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- [Ollama](https://ollama.ai) installed locally
- API keys for:
  - OpenAI (optional)
  - Anthropic (optional)
  - Perplexity (optional)

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/dexter.git
cd dexter
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Configuration

### Agent Configuration
- **Ollama Setup**: Configure local LLM models
- **API Integration**: Set up cloud AI service connections
- **Task Routing**: Customize agent selection criteria
- **Knowledge Base**: Configure storage and indexing options

### File Management
- **Watch Folders**: Set directories to monitor
- **File Types**: Configure supported file formats
- **Indexing Rules**: Customize metadata extraction
- **Search Settings**: Configure search behavior

## Architecture

### Components
- **Agent System**: Multi-agent coordination framework
- **File Manager**: File operations and indexing
- **Knowledge Base**: SQLite-based information storage
- **Task Orchestrator**: Task distribution and execution
- **Web Interface**: React-based user interface

### Data Flow
1. User submits task/query
2. Coordinator assesses requirements
3. Task Router selects appropriate agents
4. Agents execute sub-tasks
5. Results synthesized and stored
6. Response presented to user

## Development Roadmap

### High Priority
- [ ] Implement file content indexing with vector embeddings
- [ ] Add real-time file watching with chokidar
- [ ] Create REST API endpoints for file operations
- [ ] Implement robust error handling
- [ ] Add user authentication system

### Medium Priority
- [ ] Add file type previews (PDF, images, code)
- [ ] Implement semantic search functionality
- [ ] Create task scheduling system
- [ ] Add collaborative features
- [ ] Implement file metadata extraction

### Tool Integration
- [ ] Code Analysis Tools
  - Code parsers for multiple languages
  - Static analysis capabilities
  - Dependency analysis
- [ ] Data Processing Tools
  - CSV/Excel processors
  - JSON/XML parsers
  - Data visualization generators
- [ ] External APIs
  - GitHub integration
  - Documentation generators
  - Web scrapers
- [ ] Machine Learning Tools
  - Image recognition
  - Text classification
  - Sentiment analysis

### Future Enhancements
- [ ] Plugin System
  - Custom tool integration framework
  - Agent capability extensions
  - Custom UI components
- [ ] Advanced Features
  - Natural language query processing
  - Automated documentation generation
  - Code generation and refactoring
  - Data analysis and visualization
- [ ] Integration Options
  - Version control systems
  - CI/CD pipelines
  - Cloud storage providers
  - Database connectors

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.