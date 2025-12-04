#!/bin/bash

# Space Dodger - Quick Start Script

echo "🚀 Starting Space Dodger Game..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Start the API
echo -e "${BLUE}Step 1: Starting API Server...${NC}"
cd SpaceDodgerAPI

# Check if already running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}API already running on port 5000${NC}"
else
    echo "Building and starting API..."
    dotnet run --urls "http://localhost:5000" > /dev/null 2>&1 &
    API_PID=$!
    echo "API PID: $API_PID"
    
    # Wait for API to start
    echo "Waiting for API to start..."
    sleep 5
    
    if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓ API started successfully on http://localhost:5000${NC}"
        echo -e "${GREEN}✓ Swagger UI available at http://localhost:5000/swagger${NC}"
    else
        echo "Failed to start API"
        exit 1
    fi
fi

cd ..

# Step 2: Start the frontend web server
echo ""
echo -e "${BLUE}Step 2: Starting Frontend Web Server...${NC}"

# Check if already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}Web server already running on port 8000${NC}"
else
    echo "Starting web server on port 8000..."
    cd frontend
    python3 -m http.server 8000 > /dev/null 2>&1 &
    WEB_PID=$!
    echo "Web server PID: $WEB_PID"
    cd ..
    sleep 2
    echo -e "${GREEN}✓ Web server started successfully${NC}"
fi

# Step 3: Display information
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎮 Space Dodger Game is ready!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🌐 Frontend:       ${BLUE}http://localhost:8000${NC}"
echo -e "🔧 API Server:     ${BLUE}http://localhost:5000${NC}"
echo -e "📚 API Docs:       ${BLUE}http://localhost:5000/swagger${NC}"
echo ""
echo -e "${YELLOW}Default Admin Login:${NC}"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo -e "${YELLOW}To stop the servers:${NC}"
echo "  ./stop.sh"
echo ""
echo -e "${GREEN}Opening game in your browser...${NC}"
sleep 2

# Try to open browser (works on most Linux systems)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:8000 2>/dev/null
elif command -v gnome-open > /dev/null; then
    gnome-open http://localhost:8000 2>/dev/null
else
    echo "Please manually open http://localhost:8000 in your browser"
fi

echo ""
echo "Press Ctrl+C to stop viewing logs (servers will continue running)"
echo ""

# Save PIDs for stop script
echo $API_PID > .api.pid
echo $WEB_PID > .web.pid

# Wait
wait
