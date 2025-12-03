# 🚀 Space Dodger Game

A modern, full-stack space-themed dodger game with a complete RESTful API backend, JWT authentication, and real-time leaderboards.

![Space Dodger](https://img.shields.io/badge/Game-Space%20Dodger-00bcd4?style=for-the-badge)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?style=for-the-badge&logo=.net)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)

## 🎮 Live Demo

Experience the thrill of dodging asteroids while navigating through space! Register to save your scores or play as a guest.

## ✨ Features

### 🎯 Game Features
- **Smooth Canvas Gameplay** - 60 FPS HTML5 Canvas rendering
- **Progressive Difficulty** - Speed increases every 1000 points
- **Beautiful Graphics** - Enhanced spaceship and asteroid designs with particle effects
- **Visual Effects** - Engine trails, explosions, glowing effects, and twinkling stars
- **3D-Style Asteroids** - Rotating asteroids with craters and realistic textures
- **Responsive Controls** - Smooth 360° movement with arrow keys

### 🔐 Authentication System
- **User Registration & Login** - Secure JWT-based authentication
- **Guest Mode** - Play without registration (scores saved locally)
- **Role-Based Access** - Admin and User roles with different permissions
- **Secure Password Storage** - BCrypt password hashing

### 📊 Player Features
- **Real-Time Stats** - Track games played, high scores, and rankings
- **Dynamic Ranking System** - Beginner → Novice → Intermediate → Advanced → Expert → Master → Legend
- **Personal History** - View your past game sessions
- **Profile Management** - Update player information

### 🏆 Leaderboard System
- **All-Time Best** - Top players by highest score
- **Recent Scores** - Latest game sessions
- **Live Updates** - Automatic refresh after each game
- **Rank Visualization** - Gold, silver, and bronze highlighting

### 🛠️ Backend API
- **RESTful Architecture** - Clean, well-documented API
- **Full CRUD Operations** - Complete data management
- **Entity Framework Core** - Efficient database operations
- **SQLite Database** - Lightweight, embedded database
- **Swagger Documentation** - Interactive API testing interface
- **CORS Enabled** - Frontend integration ready

## 🏗️ Technology Stack

### Frontend
- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- CSS3 with animations
- Fetch API

### Backend
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- SQLite
- JWT Bearer Authentication
- BCrypt.Net (Password Hashing)
- Swagger/OpenAPI

## 📋 Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Python 3.x (for local web server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/VipulChaudhari31/dodger-game.git
cd dodger-game/spaced-dodger
```

### 2. Start the Application

#### Option A: Using Start Script (Recommended)
```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual Start

**Terminal 1 - Start API:**
```bash
cd SpaceDodgerAPI
dotnet restore
dotnet run --urls "http://localhost:5000"
```

**Terminal 2 - Start Frontend:**
```bash
cd ..
python3 -m http.server 8000
```

### 3. Access the Application

- 🎮 **Game**: http://localhost:8000
- 🔧 **API**: http://localhost:5000
- 📚 **Swagger UI**: http://localhost:5000/swagger
- ❤️ **Health Check**: http://localhost:5000/health

### 4. Stop the Application
```bash
./stop.sh
```

## 🎯 How to Play

1. **Register** a new account or **Login** with existing credentials
   - Or click "Play as Guest" for offline mode

2. **Controls:**
   - Arrow Keys: Move the spaceship
   - Avoid the red meteors
   - Survive as long as possible to increase your score

3. **Scoring:**
   - Points increase continuously while playing
   - Every 1000 points = new level
   - Higher levels = faster obstacles

4. **Ranks:**
   - Beginner (0-999)
   - Novice (1000-4999)
   - Intermediate (5000-9999)
   - Advanced (10000-19999)
   - Expert (20000-49999)
   - Master (50000-99999)
   - Legend (100000+)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Players
- `GET /api/players` - Get all players (Admin only)
- `GET /api/players/me` - Get current player stats
- `GET /api/players/{id}` - Get player by ID
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player (Admin only)

### Game Scores
- `POST /api/gamescores` - Submit new score
- `GET /api/gamescores/{id}` - Get score by ID
- `GET /api/gamescores/player/{playerId}` - Get player's scores
- `GET /api/gamescores/my-scores` - Get current user's scores
- `GET /api/gamescores/leaderboard` - Get recent scores leaderboard
- `GET /api/gamescores/leaderboard/alltime` - Get all-time best scores

### Characters
- `GET /api/characters` - Get all characters
- `GET /api/characters/{id}` - Get character by ID
- `POST /api/characters` - Create character (Admin only)
- `PUT /api/characters/{id}` - Update character (Admin only)
- `DELETE /api/characters/{id}` - Delete character (Admin only)

### Items
- `GET /api/items` - Get all items
- `GET /api/items/type/{type}` - Get items by type
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create item (Admin only)
- `PUT /api/items/{id}` - Update item (Admin only)
- `DELETE /api/items/{id}` - Delete item (Admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a token
2. Include token in Authorization header: `Bearer YOUR_TOKEN`
3. Token expires after 24 hours

### Default Admin Account
- Username: `admin`
- Password: `admin123`
- Email: `admin@spacedodger.com`

## 🛠️ Technology Stack

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite Database
- JWT Authentication
- BCrypt for password hashing
- Swagger/OpenAPI

### Frontend
- HTML5 Canvas
- Vanilla JavaScript
- CSS3 with animations
- Local Storage for guest mode

## 📊 Database Features

- **Automatic migrations** - Database created on first run
- **Seed data** - Pre-populated characters and items
- **Relationships** - Proper foreign keys and navigation properties
- **Indexes** - Optimized queries for leaderboards

## 🎨 Game Features

- **Dynamic difficulty** - Speed increases with levels
- **Particle effects** - Starfield background
- **High score tracking** - Local and server-side
- **Responsive design** - Works on different screen sizes
- **Real-time updates** - Stats refresh after each game

## 🔧 Configuration

Edit `appsettings.json` to customize:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=spacedodger.db"
  },
  "Jwt": {
    "Key": "Your-Secret-Key-Here",
    "Issuer": "SpaceDodgerAPI",
    "Audience": "SpaceDodgerClient"
  }
}
```

## 📝 API Testing

Use Swagger UI at `http://localhost:5000/swagger` to:
- View all endpoints
- Test API calls
- See request/response schemas
- Authenticate and test protected endpoints

## 🐛 Troubleshooting

**API won't start:**
- Check if port 5000 is available
- Ensure .NET 8.0 SDK is installed

**Frontend can't connect:**
- Verify API is running at `http://localhost:5000`
- Check browser console for CORS errors
- Ensure correct API_URL in script.js

**Database errors:**
- Delete `spacedodger.db` and restart API to recreate

## 📄 License

This project is for educational purposes.

## 🎓 Learning Objectives Met

✅ RESTful API design with ASP.NET Core  
✅ SQL database with Entity Framework Core  
✅ CRUD operations for all entities  
✅ JWT authentication and authorization  
✅ Role-based access control  
✅ Data validation and error handling  
✅ Database relationships and migrations  
✅ API documentation with Swagger  
✅ Frontend-backend integration  
✅ Secure password hashing  

## 🚀 Future Enhancements

- Power-ups and special abilities
- Multiplayer mode
- Achievement system
- Profile customization
- More character types
- Mobile app version

Enjoy playing Space Dodger! 🚀✨
