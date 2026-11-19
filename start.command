#!/bin/bash
# USJ Alumni Directory - Start Launcher
# Works on macOS, Linux, and GitHub Actions CI
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Locate Node.js binary
NODE_BIN=""
if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
elif [ -x "/opt/homebrew/bin/node" ]; then
  NODE_BIN="/opt/homebrew/bin/node"
elif [ -x "$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin/node" ]; then
  NODE_BIN="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin/node"
fi

# 2. Start add_member.js daemon silently if not already running
if [ -n "$NODE_BIN" ]; then
  if ! pgrep -f "add_member\.js.*--daemon" >/dev/null 2>&1; then
    nohup "$NODE_BIN" "$DIR/add_member.js" --daemon >/dev/null 2>&1 &
    sleep 0.3
  fi
fi

# 3. Open Directory in default browser (macOS: open, Linux: xdg-open)
if [ "$1" != "--no-open" ] && [ "$1" != "--daemon-only" ] && [ "$CI" != "true" ] && [ -z "$GITHUB_ACTIONS" ]; then
  if command -v open >/dev/null 2>&1; then
    open "$DIR/index.html"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$DIR/index.html"
  fi
fi

# 4. Cleanly dismiss this terminal launcher window (macOS only)
if [[ "$OSTYPE" == "darwin"* ]] && [ "$CI" != "true" ] && [ -z "$GITHUB_ACTIONS" ]; then
  osascript -e 'tell application "Terminal" to close (every window whose name contains "start")' >/dev/null 2>&1 &
fi
exit 0
