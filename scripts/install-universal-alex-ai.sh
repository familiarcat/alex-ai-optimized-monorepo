#!/bin/bash
# Universal Alex AI Installation Script
# This script installs Alex AI globally so it can be used from any project

echo "🚀 Installing Universal Alex AI..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALEX_AI_DIR="$(dirname "$SCRIPT_DIR")"

# Create global Alex AI directory
GLOBAL_ALEX_AI_DIR="$HOME/.alex-ai"
mkdir -p "$GLOBAL_ALEX_AI_DIR"

# Copy universal integration script
cp "$SCRIPT_DIR/universal-alex-ai-cursor-integration.js" "$GLOBAL_ALEX_AI_DIR/"
chmod +x "$GLOBAL_ALEX_AI_DIR/universal-alex-ai-cursor-integration.js"

# Create symlink for easy access
ln -sf "$GLOBAL_ALEX_AI_DIR/universal-alex-ai-cursor-integration.js" "$HOME/.local/bin/alex-ai"

# Add to PATH if not already there
if ! echo "$PATH" | grep -q "$HOME/.local/bin"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
    echo "✅ Added $HOME/.local/bin to PATH in ~/.zshrc"
fi

# Create alias for Cursor integration
echo 'alias engage-alex-ai="node $HOME/.alex-ai/universal-alex-ai-cursor-integration.js engage"' >> ~/.zshrc
echo 'alias alex-ai-status="node $HOME/.alex-ai/universal-alex-ai-cursor-integration.js status"' >> ~/.zshrc
echo 'alias alex-ai-task="node $HOME/.alex-ai/universal-alex-ai-cursor-integration.js task"' >> ~/.zshrc

echo "✅ Universal Alex AI installed successfully!"
echo ""
echo "🎯 Usage:"
echo "  From any project directory:"
echo "    engage-alex-ai          # Engage Alex AI for assistance"
echo "    alex-ai-status          # Show project and crew status"
echo "    alex-ai-task [task]     # Execute a specific task"
echo ""
echo "  Or directly:"
echo "    node $HOME/.alex-ai/universal-alex-ai-cursor-integration.js engage"
echo ""
echo "🔄 Please restart your terminal or run 'source ~/.zshrc' to use the new commands."
