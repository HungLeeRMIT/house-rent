#!/bin/bash

# RentMate Setup Script
# This script sets up the development environment

set -e

echo "🏠 RentMate Setup Script"
echo "============================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed${NC}"
    echo "Please install Java 21 or later"
    exit 1
else
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 21 ]; then
        echo -e "${RED}❌ Java version must be 21 or later (found: $JAVA_VERSION)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Java $JAVA_VERSION${NC}"
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed${NC}"
    echo "Please install Maven"
    exit 1
else
    MVN_VERSION=$(mvn -version | head -n 1 | awk '{print $3}')
    echo -e "${GREEN}✅ Maven $MVN_VERSION${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20 or later"
    exit 1
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo -e "${RED}❌ Node.js version must be 20 or later (found: $NODE_VERSION)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm -v)${NC}"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed${NC}"
    echo "Docker is optional but recommended for development"
else
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker is installed but not running${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Setting up backend...${NC}"
cd backend

# Build backend
echo "Building backend..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend built successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Frontend setup failed${NC}"
    exit 1
fi

cd ..

echo ""
echo "============================================"
echo -e "${GREEN}✨ Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Start MySQL:"
echo -e "   ${BLUE}docker-compose -f docker-compose.dev.yml up -d${NC}"
echo ""
echo "2. Start the development environment:"
echo -e "   ${BLUE}./scripts/start-dev.sh${NC}"
echo ""
echo "   Or manually:"
echo -e "   ${BLUE}cd backend && mvn spring-boot:run${NC}"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api"
echo ""
echo "📚 Read SETUP_GUIDE.md for detailed instructions"
echo "============================================"

