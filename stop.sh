#!/bin/bash

# Space Dodger - Stop Script

echo "🛑 Stopping Space Dodger servers..."

# Kill processes using ports
echo "Stopping API on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null
rm -f .api.pid

echo "Stopping web server on port 8000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
rm -f .web.pid

echo "✓ All servers stopped"
