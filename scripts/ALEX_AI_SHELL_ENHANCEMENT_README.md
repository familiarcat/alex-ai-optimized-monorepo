# Alex AI Monorepo Shell Enhancement System

## 🚀 Overview

The Alex AI Monorepo Shell Enhancement System transforms your oh-my-zsh shell into an intelligent, workspace-aware environment that provides real-time insights into your monorepo projects, milestone tracking, and crew personality integration.

## 🧠 Crew Expertise Integration

Each crew member brings their specialized expertise to your shell:

- **🤖 Commander Data**: Advanced analytics and pattern recognition
- **🔧 Lieutenant Commander Geordi**: Turborepo integration and shell optimization
- **🛡️ Lieutenant Worf**: Security validation and shell safety
- **🏥 Dr. Crusher**: Shell health monitoring and diagnostics
- **👨‍✈️ Captain Picard**: Strategic shell leadership and decision making
- **⚡ Commander Riker**: Tactical shell execution and coordination
- **💭 Counselor Troi**: User experience and shell empathy
- **📡 Lieutenant Uhura**: Communication and data transmission
- **💰 Quark**: Business logic and shell profit optimization

## 📦 Installation

### Quick Install

```bash
# Run the installation script
./scripts/install-alex-ai-shell-enhancement.sh

# Reload your shell
source ~/.zshrc
```

### Manual Installation

1. **Install Shell Intelligence Script**:
   ```bash
   cp scripts/alex-ai-monorepo-shell-intelligence.sh ~/.oh-my-zsh/custom/plugins/
   chmod +x ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo-shell-intelligence.sh
   ```

2. **Install Oh-My-Zsh Plugin**:
   ```bash
   mkdir -p ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo
   cp scripts/oh-my-zsh-alex-ai-monorepo-plugin.zsh ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo/alex-ai-monorepo.plugin.zsh
   ```

3. **Install Custom Theme** (Optional):
   ```bash
   cp scripts/alex-ai-monorepo.zsh-theme ~/.oh-my-zsh/custom/themes/
   ```

4. **Update .zshrc**:
   ```bash
   echo "plugins+=(alex-ai-monorepo)" >> ~/.zshrc
   # Uncomment to use the theme:
   # echo "ZSH_THEME=\"alex-ai-monorepo\"" >> ~/.zshrc
   ```

## 🎯 Features

### Workspace Awareness
- **Monorepo Detection**: Automatically detects if you're in a monorepo
- **Workspace Identification**: Shows current workspace within the monorepo
- **Package Manager Detection**: Identifies pnpm, npm, or yarn usage
- **Turborepo Integration**: Shows available tasks and configuration

### Milestone Tracking
- **Latest Milestone**: Displays the most recent milestone from git history
- **Milestone Context**: Shows milestone information in your prompt
- **Historical Tracking**: Access to milestone history and details

### Git Integration
- **Branch Awareness**: Shows current git branch
- **Status Indicators**: Displays uncommitted changes, ahead/behind status
- **Monorepo Context**: Git status with monorepo-specific information

### Crew Personality Integration
- **Time-Based Rotation**: Different crew members based on time of day
- **Personality Colors**: Each crew member has their unique color scheme
- **Contextual Information**: Crew members provide relevant information

### Health Monitoring
- **System Health**: Monitors workspace health and dependencies
- **Performance Metrics**: Tracks performance and optimization opportunities
- **Issue Detection**: Identifies potential problems and suggests solutions

## 📋 Available Commands

### Main Commands
```bash
alex-dash      # Show full workspace dashboard
alex-status    # Quick workspace status
alex-workspace # Get current workspace
alex-milestone # Get latest milestone
alex-git       # Get git status with monorepo context
alex-turbo     # Get turborepo status
alex-health    # Get workspace health
alex-crew      # Get crew status
```

### Short Aliases
```bash
ad  # alex-dash
as  # alex-status
aw  # alex-workspace
am  # alex-milestone
ag  # alex-git
at  # alex-turbo
ah  # alex-health
ac  # alex-crew
```

## 🎨 Custom Theme

The Alex AI Monorepo theme provides a rich, information-dense prompt that includes:

- **Workspace Information**: Current workspace and package manager
- **Git Status**: Branch, changes, and sync status
- **Milestone Tracking**: Latest milestone information
- **Crew Personality**: Rotating crew member based on time
- **Health Indicators**: Workspace health and status

### Theme Features
- **Color-Coded Information**: Each type of information has its own color
- **Crew Integration**: Crew members rotate based on time of day
- **Monorepo Awareness**: Only shows monorepo info when relevant
- **Compact Design**: Efficient use of screen space

## 🔧 Configuration

### Environment Variables
```bash
# Customize shell intelligence script path
export ALEX_AI_SHELL_INTELLIGENCE_PATH="/path/to/script"

# Customize crew rotation interval (hours)
export ALEX_AI_CREW_ROTATION_HOURS=1

# Enable/disable specific features
export ALEX_AI_ENABLE_MILESTONE_TRACKING=true
export ALEX_AI_ENABLE_HEALTH_MONITORING=true
export ALEX_AI_ENABLE_CREW_INTEGRATION=true
```

### Customization Options
- **Crew Rotation**: Modify the crew rotation logic in the theme
- **Color Schemes**: Customize colors for different crew members
- **Information Display**: Choose which information to show in prompts
- **Update Frequency**: Control how often information is refreshed

## 🚀 Advanced Usage

### Workspace-Specific Configuration
Create a `.alex-ai-config` file in your monorepo root:

```json
{
  "workspace": {
    "name": "My Monorepo",
    "description": "A description of your monorepo"
  },
  "milestones": {
    "enabled": true,
    "max_display_length": 50
  },
  "crew": {
    "enabled": true,
    "rotation_hours": 1
  },
  "health": {
    "enabled": true,
    "check_interval": 300
  }
}
```

### Custom Crew Members
Add your own crew members by modifying the crew rotation logic:

```bash
# In the theme file, add your custom crew members
case $((hour % 10)) in
    9) crew_member="Your Custom Member"; color="$CUSTOM_COLOR"; emoji="🎯" ;;
esac
```

### Integration with Other Tools
The shell intelligence system can be integrated with other development tools:

```bash
# Add to your .zshrc
alias my-tool='alex-status && my-tool'
alias build='alex-turbo && pnpm run build'
alias test='alex-health && pnpm run test'
```

## 🛠️ Troubleshooting

### Common Issues

1. **Plugin Not Loading**:
   ```bash
   # Check if plugin is in the right location
   ls ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo/
   
   # Verify .zshrc configuration
   grep "alex-ai-monorepo" ~/.zshrc
   ```

2. **Shell Intelligence Script Not Found**:
   ```bash
   # Check script location and permissions
   ls -la ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo-shell-intelligence.sh
   chmod +x ~/.oh-my-zsh/custom/plugins/alex-ai-monorepo-shell-intelligence.sh
   ```

3. **Theme Not Working**:
   ```bash
   # Verify theme is installed
   ls ~/.oh-my-zsh/custom/themes/alex-ai-monorepo.zsh-theme
   
   # Check .zshrc theme setting
   grep "ZSH_THEME" ~/.zshrc
   ```

### Debug Mode
Enable debug mode to see what's happening:

```bash
export ALEX_AI_DEBUG=true
source ~/.zshrc
```

## 📊 Performance

The shell enhancement system is designed to be lightweight and fast:

- **Minimal Overhead**: Only loads when needed
- **Caching**: Caches expensive operations
- **Lazy Loading**: Loads information on demand
- **Efficient Parsing**: Uses optimized parsing techniques

## 🔒 Security

The system includes several security features:

- **Input Validation**: All inputs are validated and sanitized
- **Safe Execution**: Scripts run in a controlled environment
- **Permission Checks**: Verifies file permissions before execution
- **Error Handling**: Graceful error handling and recovery

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Setup
```bash
# Clone the repository
git clone <your-fork-url>

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Oh-My-Zsh**: For the excellent shell framework
- **Turborepo**: For the monorepo build system
- **Star Trek: The Next Generation**: For the crew inspiration
- **The Alex AI Crew**: For their expertise and dedication

## 📞 Support

For support and questions:

- **GitHub Issues**: Create an issue in the repository
- **Discord**: Join our Discord server
- **Email**: Contact the development team

---

**Made with ❤️ by the Alex AI Crew**

*"Make it so!"* - Captain Picard
