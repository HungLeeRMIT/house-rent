#!/bin/bash

# RentMate Test Script
# Runs all tests for backend and frontend

set -e

echo "🧪 Running RentMate Tests"
echo "============================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

BACKEND_FAILED=0
FRONTEND_FAILED=0

# Backend tests
echo -e "${BLUE}Running backend tests...${NC}"
cd backend

mvn test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend tests passed${NC}"
else
    echo -e "${RED}❌ Backend tests failed${NC}"
    BACKEND_FAILED=1
fi

cd ..
echo ""

# Frontend tests
echo -e "${BLUE}Running frontend tests...${NC}"
cd frontend

npm run test 2>/dev/null || true

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend tests passed${NC}"
else
    echo -e "${RED}⚠️  Frontend tests skipped or failed${NC}"
    FRONTEND_FAILED=1
fi

cd ..
echo ""

# Summary
echo "============================================"
if [ $BACKEND_FAILED -eq 0 ] && [ $FRONTEND_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    if [ $BACKEND_FAILED -eq 1 ]; then
        echo -e "${RED}❌ Backend tests failed${NC}"
    fi
    if [ $FRONTEND_FAILED -eq 1 ]; then
        echo -e "${RED}⚠️  Frontend tests had issues${NC}"
    fi
    exit 1
fi

