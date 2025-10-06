#!/bin/zsh

if [ -z "$1" ]; then
  echo "Requires a shell config path, e.g. '~/.zshrc' or '~/.bashrc'"
  exit 1
fi

SHELL_CONFIG_PATH=$1
SHELL_CONFIG_SHORTENED_PATH=$1

# Convert full home path back to ~ notation if needed
if [[ "$1" == "$HOME"/* ]]; then
  SHELL_CONFIG_SHORTENED_PATH="~${SHELL_CONFIG_PATH#$HOME}"
fi

# Prompt for alias name
printf '\n\033[0;31mWhat do you want the alias to be?\033[0m\n'
read name

# Add alias to .zshrc
echo "alias $name='bun --cwd $(pwd) start'" >>$SHELL_CONFIG_PATH 2>/dev/null

# Show success message
printf '\n\033[0;32m✓ Alias '\''%s'\'' added to '$SHELL_CONFIG_SHORTENED_PATH'\033[0m\n\033[0;33mRun '\''source '$SHELL_CONFIG_SHORTENED_PATH''\'' to use it\033[0m\n' "$name"
