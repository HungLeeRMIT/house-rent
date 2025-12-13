#!/bin/bash

# RentMate Development Stop Script
# This script stops all development services

echo "🛑 Stopping RentMate Development Environment"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
    rm backend.pid
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo "Backend not running"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || true
    rm frontend.pid
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo "Frontend not running"
fi

# Stop MySQL Docker container
echo "Stopping MySQL..."
docker-compose -f docker-compose.dev.yml down
echo -e "${GREEN}✅ MySQL stopped${NC}"

echo "============================================"
echo -e "${GREEN}✅ All services stopped successfully${NC}"

