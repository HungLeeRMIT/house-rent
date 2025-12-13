#!/bin/bash

# RentMate Development Startup Script
# This script starts the development environment

set -e

echo "🏠 Starting RentMate Development Environment"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Starting MySQL database...${NC}"
docker-compose -f docker-compose.dev.yml up -d

echo -e "${GREEN}✅ MySQL is running on port 3306${NC}"
echo ""

# Wait for MySQL to be ready
echo -e "${BLUE}⏳ Waiting for MySQL to be ready...${NC}"
sleep 10

# Check if we should start backend
if [ "$1" != "db-only" ]; then
    echo -e "${BLUE}🚀 Starting Spring Boot backend...${NC}"
    cd backend
    
    # Check if maven is installed
    if ! command -v mvn &> /dev/null; then
        echo -e "${RED}❌ Maven is not installed. Please install Maven first.${NC}"
        exit 1
    fi
    
    # Start backend in background
    mvn spring-boot:run &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    
    echo -e "${GREEN}✅ Backend starting on port 8080${NC}"
    echo ""
    
    # Wait for backend to be ready
    echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is ready!${NC}"
            break
        fi
        sleep 2
    done
    echo ""
    
    # Start frontend
    echo -e "${BLUE}🎨 Starting React frontend...${NC}"
    cd frontend
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    cd ..
    
    echo -e "${GREEN}✅ Frontend starting on port 3000${NC}"
    echo ""
fi

echo "============================================"
echo -e "${GREEN}✨ RentMate is starting!${NC}"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8080/api"
echo "   MySQL:     localhost:3306"
echo ""
echo "📝 Credentials:"
echo "   MySQL User: rentmate"
echo "   MySQL Pass: rentmate123"
echo "   Database:   rentmate_dev"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-dev.sh"
echo "============================================"

