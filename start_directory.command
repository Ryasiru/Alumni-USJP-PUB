#!/bin/bash
# USJ Alumni Directory - Start Launcher (Legacy Alias)
# Works on macOS and Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Delegate to start.command
if [ -f "$DIR/start.command" ]; then
  bash "$DIR/start.command" "$@"
  exit $?
fi

# Fallback: Locate Node.js binary
NODE_BIN=""
if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
elif [ -x "/opt/homebrew/bin/node" ]; then
  NODE_BIN="/opt/homebrew/bin/node"
fi

if [ -n "$NODE_BIN" ]; then
  if ! pgrep -f "add_member\.js.*--daemon" >/dev/null 2>&1; then
    nohup "$NODE_BIN" "$DIR/add_member.js" --daemon >/dev/null 2>&1 &
    sleep 0.3
  fi
fi

if [ "$1" != "--no-open" ] && [ "$1" != "--daemon-only" ]; then
  if command -v open >/dev/null 2>&1; then
    open "$DIR/index.html"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$DIR/index.html"
  fi
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript -e 'tell application "Terminal" to close (every window whose name contains "start")' >/dev/null 2>&1 &
fi
exit 0
