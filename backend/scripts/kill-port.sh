#!/bin/bash

# Script to kill process on port 8080 (or specified port)

PORT=${1:-8080}

echo "🔍 Checking for process on port $PORT..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "✅ No process found on port $PORT"
    exit 0
fi

echo "📌 Found process: $PID"
echo "🛑 Killing process..."

kill $PID

sleep 2

# Verify it's killed
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "⚠️  Process still running, forcing kill..."
    kill -9 $PID
    sleep 1
fi

if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "❌ Failed to kill process on port $PORT"
    exit 1
else
    echo "✅ Port $PORT is now free"
    exit 0
fi

