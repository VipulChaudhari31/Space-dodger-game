# Space Dodger - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Features](#frontend-features)
7. [Setup Instructions](#setup-instructions)
8. [Testing](#testing)

---

## 🎯 Project Overview

Space Dodger is a full-stack web-based game featuring:
- **Frontend**: HTML5 Canvas game with real-time gameplay
- **Backend**: ASP.NET Core 8.0 RESTful API
- **Database**: SQLite with Entity Framework Core
- **Security**: JWT authentication with role-based authorization
- **Features**: User management, score tracking, leaderboards

### Learning Objectives Achieved ✅
- ✅ RESTful API design with ASP.NET Core
- ✅ SQL database with Entity Framework Core
- ✅ Complete CRUD operations for all entities
- ✅ JWT authentication and authorization
- ✅ Role-based access control (Admin/User)
- ✅ Data validation and error handling
- ✅ Database relationships and migrations
- ✅ API documentation with Swagger
- ✅ Frontend-backend integration
- ✅ Secure password hashing with BCrypt

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- SQLite Database
- JWT Bearer Authentication
- BCrypt.Net for password hashing
- Swagger/OpenAPI for documentation

**Frontend:**
- HTML5 with Canvas API
- Vanilla JavaScript (ES6+)
- CSS3 with animations
- Fetch API for HTTP requests
- LocalStorage for client-side persistence

### Project Structure
```
spaced-dodger/
├── SpaceDodgerAPI/              # Backend API
│   ├── Controllers/             # API Controllers
│   │   ├── AuthController.cs    # Authentication endpoints
│   │   ├── PlayersController.cs # Player management
│   │   ├── GameScoresController.cs
│   │   ├── CharactersController.cs
│   │   └── ItemsController.cs
│   ├── Models/                  # Data models
│   │   ├── User.cs
│   │   ├── Player.cs
│   │   ├── GameScore.cs
│   │   ├── Character.cs
│   │   └── Item.cs
│   ├── Data/                    # Database context
│   │   └── ApplicationDbContext.cs
│   ├── DTOs/                    # Data Transfer Objects
│   │   ├── AuthDTOs.cs
│   │   └── GameDTOs.cs
│   ├── Services/                # Business logic
│   │   └── TokenService.cs
│   ├── Program.cs               # Application entry point
│   ├── appsettings.json         # Configuration
│   └── SpaceDodgerAPI.csproj    # Project file
├── index.html                   # Frontend UI
├── style.css                    # Styling
├── script.js                    # Game logic & API integration
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide
├── API_EXAMPLES.md             # API usage examples
├── start.sh                     # Startup script
└── stop.sh                      # Shutdown script
```

---

## 🗄️ Database Schema

### Tables

#### **Users**
- Primary authentication table
```
Id (PK)           INT
Username          VARCHAR(50) UNIQUE
PasswordHash      TEXT
Email             VARCHAR(100) UNIQUE
Role              VARCHAR(20)  # "User" or "Admin"
CreatedAt         DATETIME
IsActive          BOOLEAN
```

#### **Players**
- Game profile linked to user
```
Id (PK)           INT
UserId (FK)       INT → Users.Id
PlayerName        VARCHAR(100)
TotalGamesPlayed  INT
HighestScore      INT
TotalScore        INT
DateRegistered    DATETIME
LastPlayed        DATETIME
Rank              VARCHAR(50)
```

#### **GameScores**
- Individual game session records
```
Id (PK)             INT
PlayerId (FK)       INT → Players.Id
Score               INT
Level               INT
PlayedAt            DATETIME
Duration            INT  # seconds
ObstaclesDodged     INT
PowerUpsCollected   INT
NewHighScore        BOOLEAN
Difficulty          VARCHAR(20)
```

#### **Characters**
- Playable ship types
```
Id (PK)           INT
Name              VARCHAR(100)
Type              VARCHAR(50)
Description       TEXT
Speed             INT
Size              INT
Color             VARCHAR(20)
IsUnlocked        BOOLEAN
UnlockScore       INT
CreatedAt         DATETIME
```

#### **Items**
- Power-ups and obstacles
```
Id (PK)           INT
Name              VARCHAR(100)
Type              VARCHAR(50)  # "PowerUp" or "Obstacle"
Description       TEXT
Effect            TEXT
Value             INT
Color             VARCHAR(20)
Rarity            INT  # 1-5 scale
CreatedAt         DATETIME
```

### Relationships
```
User (1) ──→ (*) Player
Player (1) ──→ (*) GameScore
```

### Indexes
- `Users.Username` (Unique)
- `Users.Email` (Unique)
- `Players.UserId`
- `GameScores.PlayerId`
- `GameScores.Score` (for leaderboard queries)

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login and get JWT token |

### Players (`/api/players`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | Yes | Admin | Get all players |
| GET | `/me` | Yes | User | Get current player stats |
| GET | `/{id}` | Yes | User/Admin | Get player by ID |
| PUT | `/{id}` | Yes | User/Admin | Update player |
| DELETE | `/{id}` | Yes | Admin | Delete player |

### Game Scores (`/api/gamescores`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Submit new score |
| GET | `/{id}` | No | Get score by ID |
| GET | `/player/{playerId}` | No | Get player's scores |
| GET | `/my-scores` | Yes | Get current user's scores |
| GET | `/leaderboard` | No | Get recent scores leaderboard |
| GET | `/leaderboard/alltime` | No | Get all-time best leaderboard |
| DELETE | `/{id}` | Yes (Admin) | Delete score |

### Characters (`/api/characters`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all characters |
| GET | `/{id}` | No | Get character by ID |
| POST | `/` | Yes (Admin) | Create character |
| PUT | `/{id}` | Yes (Admin) | Update character |
| DELETE | `/{id}` | Yes (Admin) | Delete character |

### Items (`/api/items`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all items |
| GET | `/type/{type}` | No | Get items by type |
| GET | `/{id}` | No | Get item by ID |
| POST | `/` | Yes (Admin) | Create item |
| PUT | `/{id}` | Yes (Admin) | Update item |
| DELETE | `/{id}` | Yes (Admin) | Delete item |

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "nameid": "2",
  "unique_name": "player1",
  "email": "player1@example.com",
  "role": "User",
  "exp": 1764836137,
  "iss": "SpaceDodgerAPI",
  "aud": "SpaceDodgerClient"
}
```

### Token Usage
```javascript
fetch('/api/endpoint', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
```

### Role-Based Access
- **User**: Can manage own profile and submit scores
- **Admin**: Full access to all endpoints and data

### Password Security
- Passwords hashed using BCrypt (cost factor: 11)
- Never stored or transmitted in plain text
- Validated on server side (minimum 6 characters)

---

## 🎮 Frontend Features

### Game Mechanics
1. **Player Control**: Arrow keys for 360° movement
2. **Obstacles**: Randomly spawning meteors
3. **Difficulty Scaling**: Speed increases every 1000 points
4. **Score System**: Points accumulate over time
5. **Level System**: New level every 1000 points

### UI Components
1. **Authentication Forms**: Login/Register with validation
2. **Player Dashboard**: Real-time stats display
3. **Game Canvas**: 600x400px playing field
4. **Leaderboard Modal**: Tabbed view (All-time/Recent)
5. **Guest Mode**: Play without account

### API Integration
```javascript
// Example: Submit score after game over
async function submitScore(score, level, duration) {
    const response = await fetch(`${API_URL}/gamescores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            score, level, duration,
            obstaclesDodged: Math.floor(score / 10),
            powerUpsCollected: 0,
            difficulty: 'Normal'
        })
    });
    return await response.json();
}
```

### Client-Side Storage
- **JWT Token**: Stored in localStorage
- **User Data**: Cached for quick access
- **Guest High Score**: LocalStorage fallback

---

## 🚀 Setup Instructions

### Prerequisites
- .NET 8.0 SDK
- Python 3.x (for web server)
- Modern web browser
- Terminal/Command line

### Installation

1. **Clone/Navigate to project:**
```bash
cd /home/vipul/projects/spaced-dodger
```

2. **Restore dependencies:**
```bash
cd SpaceDodgerAPI
dotnet restore
```

3. **Build project:**
```bash
dotnet build
```

4. **Run API:**
```bash
dotnet run --urls "http://localhost:5000"
```

5. **Start frontend (new terminal):**
```bash
cd ..
python3 -m http.server 8000
```

6. **Access application:**
- Game: http://localhost:8000
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

### Quick Start Scripts

**Start everything:**
```bash
./start.sh
```

**Stop everything:**
```bash
./stop.sh
```

---

## 🧪 Testing

### Manual Testing

**1. Test API Health:**
```bash
curl http://localhost:5000/health
```

**2. Test Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "playerName": "Test User",
    "password": "test123"
  }'
```

**3. Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**4. Test Leaderboard:**
```bash
curl http://localhost:5000/api/gamescores/leaderboard/alltime
```

### Swagger UI Testing
1. Navigate to http://localhost:5000/swagger
2. Click "Authorize" button
3. Enter JWT token (from login response)
4. Test any endpoint interactively

### Frontend Testing
1. Open http://localhost:8000
2. Register new account
3. Play game and verify score submission
4. Check leaderboard updates
5. Test logout and login
6. Try guest mode

---

## 📊 Seeded Data

### Default Admin
- Username: `admin`
- Password: `admin123`
- Email: `admin@spacedodger.com`

### Characters
1. Basic Ship (unlocked)
2. Speed Racer (5,000 pts)
3. Tank (10,000 pts)
4. Stealth (15,000 pts)

### Items
**Power-ups:**
1. Shield (Invincibility)
2. Speed Boost
3. Score Multiplier
4. Slow Time

**Obstacles:**
1. Meteor
2. Asteroid

---

## 🔄 Game Flow

```
User Visits Site
    ↓
Login/Register/Guest
    ↓
View Stats & Leaderboard
    ↓
Play Game
    ↓
Submit Score (if authenticated)
    ↓
Update Stats & Rankings
    ↓
View Updated Leaderboard
```

---

## 🛠️ Configuration

### API Settings (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=spacedodger.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!",
    "Issuer": "SpaceDodgerAPI",
    "Audience": "SpaceDodgerClient"
  }
}
```

### Frontend Settings (`script.js`)
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📈 Future Enhancements

- [ ] Power-ups in gameplay
- [ ] Multiple difficulty modes
- [ ] Character selection
- [ ] Achievement system
- [ ] Social features (friends, challenges)
- [ ] Mobile responsive design
- [ ] Real-time multiplayer
- [ ] Replay system
- [ ] Custom themes
- [ ] Sound effects and music

---

## 📝 License

Educational project - Free to use and modify.

---

## 👥 Support

For issues or questions:
1. Check API logs: `SpaceDodgerAPI/api.log`
2. View browser console for frontend errors
3. Use Swagger UI for API testing
4. Refer to API_EXAMPLES.md for usage examples

---

**Enjoy playing Space Dodger! 🚀✨**
