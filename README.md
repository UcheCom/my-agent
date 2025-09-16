# 🤖 AI Code Review Agent

A powerful AI-powered code review agent that automatically analyzes code changes, provides detailed feedback, generates commit messages, and creates comprehensive review reports. Built with TypeScript, Bun, and Google's Gemini AI model.

## ✨ Features

### 🔍 **Intelligent Code Analysis**
- **Automated Change Detection**: Automatically detects and analyzes git changes in your repository
- **File-by-File Review**: Provides detailed, constructive feedback for each modified file
- **Multi-Language Support**: Works with any programming language in your codebase
- **Smart Filtering**: Excludes build artifacts and lock files from analysis

### 📝 **Commit Message Generation**
- **Context-Aware Messages**: Generates meaningful commit messages based on actual code changes
- **Change Categorization**: Automatically categorizes changes (new files, deletions, modifications)
- **Statistics Integration**: Includes insertion/deletion counts in commit messages
- **Configurable Length**: Supports custom maximum message length (default: 72 characters)

### 📊 **Markdown Report Generation**
- **Comprehensive Reports**: Creates detailed markdown reports of code reviews
- **Timestamped Documentation**: Automatically adds timestamps and metadata
- **Professional Formatting**: Well-structured reports with clear sections and formatting
- **Flexible Output**: Save reports to any directory with custom filenames

### 🛠️ **Advanced Tool Integration**
- **Git Integration**: Deep integration with git repositories using simple-git
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Streaming Responses**: Real-time streaming of AI responses for better UX
- **Configurable Limits**: Adjustable step limits to control agent behavior

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.com) runtime (v1.2.22 or later)
- Node.js (for TypeScript support)
- Git repository with changes to review

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-agent
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file with your Google AI API key
   echo "GOOGLE_AI_API_KEY=your_api_key_here" > .env
   ```

### Basic Usage

```bash
# Review changes in the current directory
bun run index.ts

# The agent will automatically:
# 1. Analyze git changes
# 2. Provide detailed code review
# 3. Generate commit message suggestions
# 4. Optionally save review to markdown file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_AI_API_KEY` | Google AI API key for Gemini model | Yes | - |

### Tool Configuration

The agent includes several configurable tools:

#### `getFileChangesInDirectoryTool`
- **Purpose**: Analyzes git changes in a specified directory
- **Parameters**: 
  - `rootDir`: Directory path to analyze
- **Excludes**: `dist`, `bun.lock`, and other build artifacts

#### `generateCommitMessageTool`
- **Purpose**: Generates commit messages based on code changes
- **Parameters**:
  - `rootDir`: Directory to analyze
  - `maxLength`: Maximum message length (optional, default: 72)

#### `writeMarkdownFileTool`
- **Purpose**: Saves review results to markdown files
- **Parameters**:
  - `content`: Markdown content to write
  - `filename`: Output filename
  - `directory`: Output directory (optional, default: current directory)

## 📋 Usage Examples

### Basic Code Review
```typescript
import { codeReviewAgent } from './index';

// Review changes in a specific directory
await codeReviewAgent(
  "Review the code changes in './src' directory and provide detailed feedback"
);
```

### Generate Commit Message Only
```typescript
import { generateCommitMessageTool } from './tools';

const commitMessage = await generateCommitMessageTool.execute({
  rootDir: './src',
  maxLength: 50
});
console.log(commitMessage);
```

### Save Review to File
```typescript
import { writeMarkdownFileTool } from './tools';

await writeMarkdownFileTool.execute({
  content: "# Code Review\n\nDetailed review content...",
  filename: "code-review-report",
  directory: "./reports"
});
```

## 🏗️ Architecture

### Project Structure
```
my-agent/
├── index.ts          # Main agent implementation
├── tools.ts          # Tool definitions and implementations
├── prompts.ts        # System prompts and AI instructions
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

### Key Components

1. **AI Agent Core** (`index.ts`)
   - Streams AI responses using Google's Gemini model
   - Integrates multiple tools for comprehensive analysis
   - Configurable step limits and stopping conditions

2. **Tool System** (`tools.ts`)
   - Modular tool architecture for extensibility
   - Type-safe input/output validation with Zod
   - Git integration and file system operations

3. **Prompt Engineering** (`prompts.ts`)
   - Expert-level code review instructions
   - Clear workflow definitions
   - Professional tone and feedback guidelines

## 🎯 Code Review Focus Areas

The agent provides feedback on:

- ✅ **Correctness**: Logic errors, bugs, edge cases
- ✅ **Clarity**: Readability, naming, structure
- ✅ **Maintainability**: Complexity, duplication, coupling
- ✅ **Consistency**: Conventions, patterns, formatting
- ✅ **Performance**: Inefficiencies, bottlenecks
- ✅ **Security**: Vulnerabilities, injection risks
- ✅ **Testing**: Coverage, test quality
- ✅ **Scalability**: Error handling, robustness

## 🔄 Workflow

1. **Change Detection**: Agent scans git repository for changes
2. **File Analysis**: Reviews each modified file individually
3. **Feedback Generation**: Provides constructive, actionable feedback
4. **Commit Message**: Suggests appropriate commit messages
5. **Report Creation**: Optionally saves comprehensive markdown report

## 🛡️ Best Practices

### For Code Reviews
- Focus on high-impact issues first
- Provide specific, actionable feedback
- Balance criticism with positive reinforcement
- Consider the author's experience level

### For Commit Messages
- Use imperative mood ("Add feature" not "Added feature")
- Keep first line under 72 characters
- Include context when necessary
- Reference issues or tickets when applicable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for the Gemini AI model
- [Bun](https://bun.com) for the fast JavaScript runtime
- [Simple Git](https://github.com/steveukx/git-js) for git operations
- [Zod](https://zod.dev/) for schema validation
- [AI SDK](https://sdk.vercel.ai/) for AI integration

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using TypeScript, Bun, and AI**