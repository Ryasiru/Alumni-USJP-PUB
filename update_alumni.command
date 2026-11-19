#!/bin/bash
# Works on macOS and Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Locate Node.js binary
NODE_BIN=""
if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
elif [ -x "/opt/homebrew/bin/node" ]; then
  NODE_BIN="/opt/homebrew/bin/node"
fi

# 2. Start add_member.js daemon silently if not already running
if [ -n "$NODE_BIN" ]; then
  if ! pgrep -f "add_member\.js.*--daemon" >/dev/null 2>&1; then
    nohup "$NODE_BIN" "$DIR/add_member.js" --daemon >/dev/null 2>&1 &
    sleep 0.3
  fi
fi

# 3. Open Update Alumni page in default browser (macOS: open, Linux: xdg-open)
if command -v open >/dev/null 2>&1; then
  open "$DIR/update-alumni.html"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$DIR/update-alumni.html"
fi

# 4. Cleanly dismiss this terminal launcher window (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript -e 'tell application "Terminal" to close (every window whose name contains "update_alumni")' >/dev/null 2>&1 &
fi
exit 0
