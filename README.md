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

1. **Register/Login**: Create an account or log in with existing credentials
   - Default admin: `admin` / `admin123`
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
├── SpaceDodgerAPI/              # Backend API
│   ├── Controllers/             # API Controllers
│   │   ├── AuthController.cs
│   │   ├── PlayersController.cs
│   │   ├── GameScoresController.cs
│   │   ├── CharactersController.cs
│   │   └── ItemsController.cs
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
│   └── Program.cs               # Entry point
├── index.html                   # Game frontend
├── script.js                    # Game logic & API integration
├── style.css                    # Styling & animations
├── start.sh                     # Start script
├── stop.sh                      # Stop script
├── README.md                    # This file
├── QUICKSTART.md                # Quick setup guide
├── API_EXAMPLES.md              # API usage examples
└── PROJECT_DOCUMENTATION.md     # Detailed documentation
```

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

### API Issues
**API won't start:**
- Check if port 5000 is available: `lsof -i :5000`
- Ensure .NET 8.0 SDK is installed: `dotnet --version`
- Check for compilation errors: `dotnet build`

**Database errors:**
- Delete `spacedodger.db` and restart API to recreate
- Check migrations: `dotnet ef migrations list`
- Ensure SQLite package is installed

### Frontend Issues
**Frontend can't connect:**
- Verify API is running at `http://localhost:5000`
- Check browser console for CORS errors
- Ensure correct API_URL in `script.js`
- Try different browser if CORS issues persist

**Game won't load:**
- Clear browser cache and reload
- Check if port 8000 is available: `lsof -i :8000`
- Ensure Python 3 is installed: `python3 --version`

**Token expired:**
- Re-login to get a new JWT token
- Check token expiry in browser DevTools → Application → Local Storage

### Common Solutions
```bash
# Kill processes on ports
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:8000)

# Clean and rebuild API
cd SpaceDodgerAPI
dotnet clean
dotnet build

# Reset database
rm spacedodger.db
dotnet run
```

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

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Vipul Chaudhari](https://github.com/VipulChaudhari31)

</div>
