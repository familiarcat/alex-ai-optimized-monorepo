# Alex AI VS Code Extension

AI-powered coding assistant with specialized crew members for enhanced development experience, similar to Cursor's AI capabilities but with Alex AI's unique crew system.

## 🚀 Features

- **Natural Language Interaction**: "Engage Alex AI" command for natural language queries (similar to Cursor AI)
- **Chat Interface**: Interactive chat with Alex AI crew members
- **Crew Members**: 9 specialized AI assistants with unique personalities and expertise
- **Context Awareness**: Understands your current code, project structure, and dependencies
- **Code Actions**: Explain, generate, refactor, and optimize code
- **Real-time Assistance**: Get help while coding without leaving VS Code
- **Quick Actions**: Predefined prompts for common development tasks

## 👥 Crew Members

- **Captain Jean-Luc Picard** - Strategic Planning & Leadership
- **Commander William Riker** - Tactical Execution & Code Implementation  
- **Commander Data** - Data Analysis & Logic Operations
- **Geordi La Forge** - Engineering & System Integration
- **Lieutenant Worf** - Security & Testing
- **Dr. Beverly Crusher** - Performance Optimization & Health Monitoring
- **Counselor Deanna Troi** - User Experience & Quality Assurance
- **Lieutenant Uhura** - Communications & Workflow Automation
- **Quark** - Business Analysis & ROI Optimization

## 🛠️ Installation

1. Install the extension from VS Code Marketplace
2. Configure your Alex AI API URL and key in settings
3. Start chatting with your AI crew!

## ⚙️ Configuration

- `alex-ai.apiUrl`: Alex AI API base URL (default: http://localhost:3000)
- `alex-ai.apiKey`: API key for authentication
- `alex-ai.defaultCrewMember`: Default crew member for assistance
- `alex-ai.enableContextAwareness`: Enable context awareness (default: true)
- `alex-ai.maxContextLength`: Maximum context length (default: 4000)

## 🎯 Usage

### Natural Language Commands (Cursor AI Style)
- `Ctrl+Shift+P` → "Alex AI: Engage Alex AI" - Natural language interaction
- `Ctrl+Shift+P` → "Alex AI: Quick Engage Alex AI" - Predefined prompts
- Click robot icon in status bar → Engage Alex AI

### Traditional Chat Commands
- `Ctrl+Shift+P` → "Alex AI: Open Chat"
- `Ctrl+Shift+P` → "Alex AI: Explain Code"
- `Ctrl+Shift+P` → "Alex AI: Generate Code"
- `Ctrl+Shift+P` → "Alex AI: Refactor Code"
- `Ctrl+Shift+P` → "Alex AI: Optimize Code"

### Right-click Context Menu
- Select code and right-click → "Ask Alex AI" options
- Get instant explanations and suggestions
- "Engage Alex AI" for natural language queries

### Status Bar
- Click the Alex AI robot icon to engage Alex AI with natural language
- Shows connection status and active crew member

### Example Usage
```
User: "engage Alex AI - help me create a React component for user authentication"
Alex AI: "I'll help you create a user authentication component. Let me analyze your project structure and suggest the best approach..."

User: "engage Alex AI - optimize this function for better performance"
Alex AI: "I'll analyze the performance bottlenecks in your function and suggest optimizations..."
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

## 📦 Building

```bash
# Install vsce
npm install -g vsce

# Package extension
vsce package

# Install locally
code --install-extension alex-ai-1.0.0.vsix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- GitHub Issues: Report bugs and request features
- Documentation: Check the wiki for detailed guides
- Community: Join our Discord server

---

**Made with ❤️ by the Alex AI team**







