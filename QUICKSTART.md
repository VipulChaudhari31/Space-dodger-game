# Space Dodger - Quick Start Guide

## 🚀 Starting the Application

### Option 1: Using the Start Script (Easiest)
```bash
cd /home/vipul/projects/spaced-dodger
./start.sh
```

This will:
- Start the API server on port 5000
- Start the web server on port 8000
- Open the game in your browser

### Option 2: Manual Start

**Terminal 1 - Start API:**
```bash
cd /home/vipul/projects/spaced-dodger/SpaceDodgerAPI
dotnet run --urls "http://localhost:5000"
```

**Terminal 2 - Start Frontend:**
```bash
cd /home/vipul/projects/spaced-dodger
python3 -m http.server 8000
```

**Open Browser:**
```
http://localhost:8000
```

## 🎮 Playing the Game

### First Time Users

1. **Register a new account:**
   - Click the "Register" tab
   - Fill in username, email, player name, and password
   - Click "Register"

2. **Or play as guest:**
   - Click "Play as Guest" button
   - Scores won't be saved to server in guest mode

### Returning Users

1. Click "Login" tab
2. Enter your username and password
3. Click "Login"

### Admin Access

- Username: `admin`
- Password: `admin123`
- Admin can view all players and manage game content

## 🕹️ Game Controls

- **Arrow Keys**: Move the spaceship in all directions
- **Objective**: Avoid the red meteors
- **Scoring**: Points increase continuously while playing
- **Levels**: Every 1000 points = new level (obstacles get faster)

## 📊 Features

### Player Stats
- High Score
- Games Played
- Current Rank (Beginner → Legend)
- Average Score

### Leaderboard
- **All-Time Best**: Highest scores ever recorded
- **Recent Scores**: Latest game sessions

### Ranks
- Beginner: 0-999 points
- Novice: 1,000-4,999
- Intermediate: 5,000-9,999
- Advanced: 10,000-19,999
- Expert: 20,000-49,999
- Master: 50,000-99,999
- Legend: 100,000+

## 🔧 Troubleshooting

### API won't start
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Restart API
cd /home/vipul/projects/spaced-dodger/SpaceDodgerAPI
dotnet run --urls "http://localhost:5000"
```

### Frontend won't connect
1. Check API is running: `curl http://localhost:5000/health`
2. Verify API URL in browser console
3. Clear browser cache and reload

### Database issues
```bash
cd /home/vipul/projects/spaced-dodger/SpaceDodgerAPI
rm spacedodger.db  # Delete database
dotnet run         # Restart API (recreates database)
```

## 🛑 Stopping the Application

### Using Stop Script
```bash
cd /home/vipul/projects/spaced-dodger
./stop.sh
```

### Manual Stop
```bash
# Stop API (port 5000)
lsof -ti:5000 | xargs kill -9

# Stop web server (port 8000)
lsof -ti:8000 | xargs kill -9
```

## 🌐 URLs

- **Game**: http://localhost:8000
- **API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health

## 📚 Additional Resources

- **API Documentation**: See `API_EXAMPLES.md`
- **Full README**: See `README.md`
- **Test API**: Use Swagger UI at http://localhost:5000/swagger

## 💡 Tips

1. **Guest Mode**: Perfect for quick testing without registration
2. **High Scores**: Logged-in users' scores are saved permanently
3. **Leaderboard**: Check your rank against other players
4. **Swagger UI**: Test all API endpoints interactively
5. **Admin Panel**: Login as admin to manage game data

## 🎯 Game Tips

1. Start in the center for maximum maneuverability
2. Watch obstacle patterns as speed increases
3. Higher levels = faster obstacles but more points
4. Practice makes perfect - keep trying to beat your high score!

Enjoy playing Space Dodger! 🚀✨
