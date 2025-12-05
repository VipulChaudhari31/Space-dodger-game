# 🚀 Space Dodger Game

A modern, full-stack space-themed dodger game with a complete RESTful API backend, JWT authentication, real-time leaderboards, and comprehensive admin dashboard.

## 🎮 Live Demo

Experience the thrill of dodging asteroids while navigating through space! Register to save your scores, play as a guest, or login as admin to manage the entire system.

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
- **Auto-Created Admin** - Admin user automatically created on first run

### 👨‍💼 Admin Panel
- **Statistics Dashboard** - Real-time overview of all system metrics
- **User Management** - Full CRUD operations for users (view, edit, delete)
- **Player Management** - Manage player profiles and statistics
- **Game Score Management** - View and delete game scores
- **Character Management** - Add, edit, and delete game characters
- **Item Management** - Manage power-ups and obstacles
- **Direct Admin Access** - Admins automatically redirected to admin panel on login
- **Beautiful Admin UI** - Cyberpunk-themed admin interface matching game aesthetics

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

## 🗄️ Database Schema

### Tables Structure

#### Users Table
Primary authentication table
```
Id (PK)           INT
Username          VARCHAR(50) UNIQUE
PasswordHash      TEXT
Email             VARCHAR(100) UNIQUE
Role              VARCHAR(20)  # "User" or "Admin"
CreatedAt         DATETIME
IsActive          BOOLEAN
```

#### Players Table
Game profile linked to user
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

#### GameScores Table
Individual game session records
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

#### Characters Table
Playable ship types
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

#### Items Table
Power-ups and obstacles
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

### Database Relationships
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

### Database Features
- **Automatic migrations** - Database created on first run
- **Seed data** - Pre-populated characters and items
- **Relationships** - Proper foreign keys and navigation properties
- **Indexes** - Optimized queries for leaderboards

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
- ⚙️ **Admin Panel**: http://localhost:8000/admin.html
- 🔧 **API**: http://localhost:5000
- 📚 **Swagger UI**: http://localhost:5000/swagger
- ❤️ **Health Check**: http://localhost:5000/health

### 4. Default Admin Account
- Username: `admin`
- Password: `admin123`
- Email: `admin@spacedodger.com`
- **Note**: Admin user is automatically created on first application run

### 5. Stop the Application
```bash
./stop.sh
```

## 🎯 How to Play

1. **Register/Login**: Create an account or log in with existing credentials
   - Regular users: Register and play the game
   - Admin access: `admin` / `admin123` (redirects to admin panel)
   - Or click "Play as Guest" for offline mode

2. **Start Game**: Click "Start Game" to begin your space adventure

3. **Controls**: Use **Arrow Keys** (← →) or **A/D keys** to move your spaceship

4. **Objective**: Dodge asteroids and survive as long as possible

5. **Scoring**: 
   - +1 point per second survived
   - +10 points for each asteroid dodged
   - Every 1000 points = new level with faster obstacles

6. **Ranks:**
   - 🥉 Beginner (0-999)
   - 🥈 Novice (1000-4999)
   - 🥇 Intermediate (5000-9999)
   - ⭐ Advanced (10000-19999)
   - 💎 Expert (20000-49999)
   - 👑 Master (50000-99999)
   - 🏆 Legend (100000+)

7. **Submit Score**: After game over, your score is automatically saved to the leaderboard

8. **Compete**: Check the leaderboard to see how you rank against other players!

### 🎮 Game Tips
- Watch asteroid rotation patterns to predict movement
- Use engine particles to track your ship's momentum
- Explosions indicate collisions - learn from each crash!
- Higher scores unlock better leaderboard positions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Admin Operations (Admin Role Required)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/players` - Get all players
- `GET /api/admin/players/{id}` - Get player details
- `PUT /api/admin/players/{id}` - Update player
- `DELETE /api/admin/players/{id}` - Delete player
- `GET /api/admin/gamescores` - Get all game scores
- `DELETE /api/admin/gamescores/{id}` - Delete game score
- `GET /api/admin/characters` - Get all characters
- `POST /api/admin/characters` - Create character
- `PUT /api/admin/characters/{id}` - Update character
- `DELETE /api/admin/characters/{id}` - Delete character
- `GET /api/admin/items` - Get all items
- `POST /api/admin/items` - Create item
- `PUT /api/admin/items/{id}` - Update item
- `DELETE /api/admin/items/{id}` - Delete item

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

## 👨‍💼 Admin Panel Features

The admin panel provides complete system management capabilities:

### Dashboard Statistics
- Total Users & Active Users
- Total Players & Games Played
- Total Characters & Items
- Highest Score & Average Score

### Management Capabilities

#### 👥 User Management
- View all registered users
- Edit user email, role, and status
- Activate/Deactivate user accounts
- Delete users (except admin)

#### 🎮 Player Management
- View all player profiles
- Edit player names and ranks
- Update highest scores manually
- Delete players (cascades to scores)

#### 🏆 Game Score Management
- View all game scores with details
- Filter scores by player
- See score, level, duration, obstacles dodged
- Delete individual scores

#### 🚀 Character Management
- Add new characters with custom properties
- Edit character name, type, description
- Configure speed, size, and color
- Set unlock conditions and scores
- Visual color preview for each character

#### ⭐ Item Management
- Create new items and power-ups
- Edit item properties and effects
- Configure rarity levels (1-5)
- Set colors and visual attributes
- Manage obstacle types

### Admin UI Features
- **Responsive Design** - Works on all screen sizes
- **Tab Navigation** - Easy switching between management sections
- **Modal Forms** - Clean edit/add interfaces
- **Real-time Updates** - Instant data refresh
- **Color Preview** - Visual display for character/item colors
- **Confirmation Dialogs** - Prevent accidental deletions
- **Status Indicators** - Active/Inactive visual badges

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a token
2. Include token in Authorization header: `Bearer YOUR_TOKEN`
3. Token expires after 24 hours

### Default Admin Account
- Username: `admin`
- Password: `admin123`
- Email: `admin@spacedodger.com`
- **Automatically Created**: On first application startup
- **Cannot be Deleted**: System protection for admin account

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

## 🎨 Visual Features

### Enhanced Spaceship Design
- **3D Appearance**: Gradient hull with depth and dimension
- **Glowing Cockpit**: Bright cyan cockpit window with glow effect
- **Wing Details**: Metallic wings with gradient shading
- **Engine Effects**: Real-time cyan particle system trailing behind

### Asteroid Graphics
- **Rotating 3D Asteroids**: Each asteroid slowly rotates for realism
- **Crater Details**: Random crater patterns on asteroid surfaces
- **Gradient Shading**: Depth perception with multi-color gradients
- **Glow Effects**: Subtle orange/red glow around asteroids
- **Particle Trails**: Small particles trail behind fast-moving asteroids

### Special Effects
- **Engine Particles**: Cyan particles constantly emit from spaceship engines
- **Explosion System**: 30-particle explosion on collision with varied colors (red, orange, yellow)
- **Starfield Background**: 150 twinkling stars with depth parallax
- **Smooth Animations**: 60 FPS gameplay with particle physics

### UI Enhancements
- **Pulsing Canvas Border**: Animated border that pulses with the game
- **Glowing Text**: Score and stats with text-shadow effects
- **Animated Modals**: Smooth slide-in animations for login/register
- **Button Ripple Effects**: Interactive button feedback

## 🏗️ Project Structure

```
spaced-dodger/
├── frontend/                    # Frontend files
│   ├── index.html              # Game interface
│   ├── script.js               # Game logic & API integration
│   ├── style.css               # Game styling
│   ├── admin.html              # Admin panel interface
│   ├── admin.js                # Admin panel logic
│   └── admin.css               # Admin panel styling
├── SpaceDodgerAPI/             # Backend API
│   ├── Controllers/             # API Controllers
│   │   ├── AuthController.cs
│   │   ├── PlayersController.cs
│   │   ├── GameScoresController.cs
│   │   ├── CharactersController.cs
│   │   ├── ItemsController.cs
│   │   └── AdminController.cs   # Admin management endpoints
│   ├── Models/                  # Data models
│   │   ├── User.cs
│   │   ├── PlayerProfile.cs
│   │   ├── GameScore.cs
│   │   ├── Character.cs
│   │   └── Item.cs
│   ├── Data/                    # Database context
│   │   └── ApplicationDbContext.cs
│   ├── DTOs/                    # Data transfer objects
│   │   └── ApiDTOs.cs
│   ├── Services/                # Business logic
│   │   └── TokenService.cs
│   ├── Migrations/              # EF Core migrations
│   ├── appsettings.json         # Configuration
│   ├── spacedodger.db          # SQLite database (auto-created)
│   └── Program.cs               # Entry point & admin user creation
├── index.html                   # (Moved to frontend/)
├── script.js                    # (Moved to frontend/)
├── style.css                    # (Moved to frontend/)
├── start.sh                     # Start script
├── stop.sh                      # Stop script
├── README.md                    # This file
├── QUICKSTART.md                # Quick setup guide
├── API_EXAMPLES.md              # API usage examples
└── PROJECT_DOCUMENTATION.md     # Detailed documentation
```

## 🔧 Configuration

### API Settings

Edit `SpaceDodgerAPI/appsettings.json` to customize:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=spacedodger.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!",
    "Issuer": "SpaceDodgerAPI",
    "Audience": "SpaceDodgerClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Settings

Edit `frontend/script.js` to change API URL:

```javascript
const API_URL = 'http://localhost:5000/api';
```

### Environment Variables

Optional environment variables:
```bash
export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS=http://localhost:5000
```

## 📊 Seeded Data

The database is automatically populated with initial data on first run:

### Default Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@spacedodger.com`
- **Role:** Admin
- **Auto-created:** Yes (on first startup)

### Characters (Pre-populated)
1. **Basic Ship**
   - Type: Fighter
   - Speed: 5
   - Unlocked by default
   
2. **Speed Racer**
   - Type: Racer
   - Speed: 8
   - Unlock Score: 5,000 points
   
3. **Tank**
   - Type: Heavy
   - Speed: 3
   - Unlock Score: 10,000 points
   
4. **Stealth**
   - Type: Stealth
   - Speed: 6
   - Unlock Score: 15,000 points

### Items (Pre-populated)

**Power-ups:**
1. **Shield** - Temporary invincibility
2. **Speed Boost** - Increased movement speed
3. **Score Multiplier** - 2x points
4. **Slow Time** - Slows down obstacles

**Obstacles:**
1. **Meteor** - Standard obstacle
2. **Asteroid** - Larger, slower obstacle

## 📝 API Testing

```
User Visits Site
    ↓
┌─────────────────┐
│ Authentication  │
│  - Login        │
│  - Register     │
│  - Guest Mode   │
└────────┬────────┘
         ↓
┌─────────────────┐
│  View Stats &   │
│  Leaderboard    │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Play Game     │
│  - Move Ship    │
│  - Dodge        │
│  - Score Points │
└────────┬────────┘
         ↓
    Game Over
         ↓
┌─────────────────┐
│ Submit Score    │
│ (if logged in)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Update Stats &  │
│   Rankings      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ View Updated    │
│  Leaderboard    │
└─────────────────┘
         ↓
    Play Again?
```

### Admin Flow
```
Admin Login (admin/admin123)
         ↓
┌─────────────────────┐
│  Admin Dashboard    │
│  - View Statistics  │
└──────────┬──────────┘
           ↓
   ┌───────┴───────┐
   │ Management    │
   │   Options     │
   └───────┬───────┘
           ↓
  ┌────────┼────────┐
  │        │        │
┌─▼──┐  ┌─▼──┐  ┌─▼──┐
│User│  │Play│  │Game│
│Mgmt│  │ er │  │Scor│
└─┬──┘  └─┬──┘  └─┬──┘
  │        │        │
  └────────┼────────┘
           ↓
  ┌────────┼────────┐
  │        │        │
┌─▼──┐  ┌─▼──┐
│Char│  │Item│
│Mgmt│  │Mgmt│
└────┘  └────┘
```

## 🐛 Troubleshooting

### API Issues
**API won't start:**
```bash
# Check if port 5000 is available
lsof -i :5000

# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Ensure .NET 8.0 SDK is installed
dotnet --version

# Check for compilation errors
cd SpaceDodgerAPI
dotnet build

# Restart API
dotnet run --urls "http://localhost:5000"
```

**Database errors:**
```bash
cd SpaceDodgerAPI
rm spacedodger.db  # Delete database
dotnet run         # Restart API (recreates database with admin)
```

### Frontend Issues
**Frontend can't connect:**
1. Verify API is running: `curl http://localhost:5000/health`
2. Check browser console for CORS errors
3. Ensure correct API_URL in `frontend/script.js`
4. Clear browser cache and reload
5. Try different browser if CORS issues persist

**Game won't load:**
```bash
# Check if port 8000 is available
lsof -i :8000

# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Ensure Python 3 is installed
python3 --version

# Restart frontend server
python3 -m http.server 8000
```

**Token expired:**
- Re-login to get a new JWT token (24-hour expiry)
- Check token in browser DevTools → Application → Local Storage
- Clear localStorage if having issues: `localStorage.clear()`

**Admin redirect not working:**
```bash
# Clear browser cache and localStorage
# In browser console:
localStorage.clear();
location.reload();
```

### Common Solutions
```bash
# Kill all processes
cd spaced-dodger
./stop.sh

# Clean and rebuild API
cd SpaceDodgerAPI
dotnet clean
dotnet build

# Reset database completely
rm spacedodger.db
dotnet run  # Creates new database with admin user

# Restart everything
cd ..
./start.sh
```

### Testing Checklist
- [ ] API health check: `curl http://localhost:5000/health`
- [ ] Swagger UI accessible: http://localhost:5000/swagger
- [ ] Frontend loads: http://localhost:8000
- [ ] Admin panel loads: http://localhost:8000/admin.html
- [ ] Can register new user
- [ ] Can login as admin (admin/admin123)
- [ ] Game starts and runs smoothly
- [ ] Scores submit successfully
- [ ] Leaderboard updates

## 🧪 Testing

### Manual API Testing

**1. Test API Health:**
```bash
curl http://localhost:5000/health
# Expected: {"status":"Healthy"}
```

**2. Test User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "playerName": "Test Player",
    "password": "test123"
  }'
```

**3. Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
# Save the token from response
```

**4. Test Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**5. Test Protected Endpoint:**
```bash
TOKEN="your-jwt-token-here"
curl -X GET http://localhost:5000/api/players/me \
  -H "Authorization: Bearer $TOKEN"
```

**6. Test Score Submission:**
```bash
curl -X POST http://localhost:5000/api/gamescores \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 5000,
    "level": 5,
    "duration": 120,
    "obstaclesDodged": 50,
    "powerUpsCollected": 0,
    "difficulty": "Normal"
  }'
```

**7. Test Leaderboard:**
```bash
curl http://localhost:5000/api/gamescores/leaderboard/alltime
```

**8. Test Admin Statistics:**
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Swagger UI Testing

1. Navigate to http://localhost:5000/swagger
2. Click **"Authorize"** button (top right)
3. Enter: `Bearer your-jwt-token`
4. Click **"Authorize"** then **"Close"**
5. Test any endpoint interactively
6. View request/response schemas

### Frontend Testing Checklist

#### Authentication Flow
- [ ] Register new user with valid data
- [ ] Register fails with duplicate username
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Admin login redirects to admin panel
- [ ] Regular user login shows game
- [ ] Logout clears token
- [ ] Token persists across page reloads

#### Game Functionality
- [ ] Game canvas renders properly
- [ ] Spaceship appears and can move
- [ ] Arrow keys control movement
- [ ] Obstacles spawn and move
- [ ] Collision detection works
- [ ] Score increases during gameplay
- [ ] Level increases every 1000 points
- [ ] Game over triggers on collision
- [ ] Score submits after game over

#### Admin Panel
- [ ] Dashboard loads with statistics
- [ ] User management table displays
- [ ] Can edit user details
- [ ] Can delete users (except admin)
- [ ] Player management works
- [ ] Game scores display correctly
- [ ] Can add new character
- [ ] Can edit character properties
- [ ] Can add new item
- [ ] Modal forms open and close

#### Leaderboard
- [ ] All-time leaderboard displays
- [ ] Recent scores show latest games
- [ ] Scores sorted correctly
- [ ] Player stats update after game
- [ ] Rank displays correctly
- [ ] Leaderboard refreshes automatically

#### Guest Mode
- [ ] Can play without login
- [ ] Local high score saves
- [ ] Guest scores don't submit to server
- [ ] Can switch to login from guest

### Performance Testing

**API Response Times:**
```bash
# Test response time
time curl http://localhost:5000/api/gamescores/leaderboard/alltime

# Load test (requires Apache Bench)
ab -n 1000 -c 10 http://localhost:5000/health
```

**Database Query Performance:**
- Leaderboard queries should complete < 100ms
- User lookup by username should be < 10ms
- Score submission should complete < 50ms

### Test Results Summary

✅ **API Endpoints** - All 40+ endpoints tested and working
✅ **Authentication** - Login, register, JWT tokens functional
✅ **Authorization** - Role-based access control working
✅ **Database** - All CRUD operations successful
✅ **Frontend** - Game renders and plays smoothly
✅ **Admin Panel** - Full management capabilities functional
✅ **Leaderboard** - Real-time updates working
✅ **Guest Mode** - Offline play functional

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/VipulChaudhari31/dodger-game.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed
- Keep commits focused and atomic

### Ideas for Contributions
- 🎨 New visual effects and animations
- 🎮 Additional game modes (survival, time attack)
- 🏆 Achievement system implementation
- 🌐 Internationalization (i18n) support
- 📱 Mobile responsive improvements
- 🧪 Unit and integration tests
- 📊 Analytics and statistics features
- 👨‍💼 Enhanced admin features (bulk operations, export data)
- 🔍 Advanced search and filtering in admin panel
- 📈 Charts and graphs for admin dashboard

## 📧 Contact

**Developer**: Vipul Chaudhari  
**GitHub**: [@VipulChaudhari31](https://github.com/VipulChaudhari31)  
**Repository**: [dodger-game](https://github.com/VipulChaudhari31/dodger-game)

Feel free to open an issue for bugs, questions, or feature requests!

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
✅ Secure password hashing with BCrypt  
✅ Canvas-based game development  
✅ Particle system implementation  
✅ Real-time leaderboard system  
✅ Admin dashboard with full CRUD operations  
✅ Role-based UI routing (Admin vs User)  
✅ Automatic admin user initialization  
✅ Responsive admin panel design  

## 🚀 Future Enhancements

- [ ] Power-ups and special abilities
- [ ] Multiplayer mode with WebSockets
- [ ] Achievement system with badges
- [ ] Profile customization (avatars, themes)
- [ ] More character types and items
- [ ] Mobile app version (React Native)
- [ ] Sound effects and background music
- [ ] Daily challenges and rewards
- [ ] Social features (friends, challenges)
- [ ] Advanced analytics dashboard
- [ ] Export admin data to CSV/Excel
- [ ] Audit logs for admin actions
- [ ] Email notifications for achievements
- [ ] Scheduled tasks and automated backups

---

## ✅ Project Status: **PRODUCTION READY**

### 🎯 All Requirements Met

**Backend (100% Complete)**
- ✅ RESTful API with ASP.NET Core 8.0
- ✅ SQL Database (SQLite) with proper schema
- ✅ Entity Framework Core integration
- ✅ Full CRUD operations for all 5 entities
- ✅ JWT Authentication system
- ✅ Role-based Authorization (Admin/User)
- ✅ BCrypt password hashing
- ✅ Data validation on all inputs
- ✅ Error handling with proper HTTP codes
- ✅ Swagger/OpenAPI documentation
- ✅ CORS configuration
- ✅ Health check endpoint

**Frontend (100% Complete)**
- ✅ HTML5 Canvas game with 60 FPS
- ✅ Responsive UI design
- ✅ Authentication forms (Login/Register)
- ✅ Real-time gameplay with smooth controls
- ✅ Player dashboard and statistics
- ✅ Leaderboard system (All-time & Recent)
- ✅ Admin panel with full CRUD operations
- ✅ Guest mode for offline play
- ✅ API integration with error handling
- ✅ Token management and persistence

**Admin Panel (100% Complete)**
- ✅ Statistics dashboard with 8 metrics
- ✅ User management (View, Edit, Delete)
- ✅ Player management (Full CRUD)
- ✅ Game score management
- ✅ Character management (Add, Edit, Delete)
- ✅ Item management (Add, Edit, Delete)
- ✅ Beautiful cyberpunk-themed UI
- ✅ Role-based access control
- ✅ Modal-based editing system
- ✅ Real-time data refresh

**Integration & Testing (100% Complete)**
- ✅ Frontend-backend integration working
- ✅ All API endpoints tested and functional
- ✅ Authentication flow validated
- ✅ Score submission and leaderboard updates
- ✅ Admin operations tested
- ✅ Database relationships verified
- ✅ Performance optimized

### 📦 Deliverables

**40+ API Endpoints** across 6 controllers  
**5 Database Tables** with proper relationships  
**Admin Dashboard** with complete system management  
**Real-time Leaderboard** with ranking system  
**Secure Authentication** with JWT and BCrypt  
**Auto-created Admin** user on first run  
**One-command Startup** via start.sh script  
**Comprehensive Documentation** across multiple files  

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Vipul Chaudhari](https://github.com/VipulChaudhari31)

**Ready to play! 🚀✨**

</div>
