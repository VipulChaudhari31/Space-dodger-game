# Space Dodger API - Test Examples

## Base URL
```
http://localhost:5000/api
```

## Health Check
```bash
curl http://localhost:5000/health
```

## 1. Authentication

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "email": "player1@example.com",
    "playerName": "Player One",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "password": "password123"
  }'
```

**Response includes JWT token:**
```json
{
  "token": "eyJhbGc...",
  "userId": 2,
  "username": "player1",
  "role": "User",
  "playerId": 1,
  "playerName": "Player One"
}
```

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## 2. Player Management

### Get Current Player Stats
```bash
TOKEN="your-jwt-token-here"

curl http://localhost:5000/api/players/me \
  -H "Authorization: Bearer $TOKEN"
```

### Get Player by ID
```bash
curl http://localhost:5000/api/players/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Players (Admin Only)
```bash
curl http://localhost:5000/api/players \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 3. Game Scores

### Submit Score
```bash
curl -X POST http://localhost:5000/api/gamescores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 25000,
    "level": 25,
    "duration": 300,
    "obstaclesDodged": 250,
    "powerUpsCollected": 10,
    "difficulty": "Normal"
  }'
```

### Get My Scores
```bash
curl http://localhost:5000/api/gamescores/my-scores \
  -H "Authorization: Bearer $TOKEN"
```

### Get All-Time Leaderboard
```bash
curl http://localhost:5000/api/gamescores/leaderboard/alltime?limit=10
```

### Get Recent Scores Leaderboard
```bash
curl http://localhost:5000/api/gamescores/leaderboard?limit=10
```

### Get Player's Scores
```bash
curl http://localhost:5000/api/gamescores/player/1
```

## 4. Characters

### Get All Characters
```bash
curl http://localhost:5000/api/characters
```

### Get Character by ID
```bash
curl http://localhost:5000/api/characters/1
```

### Create Character (Admin Only)
```bash
curl -X POST http://localhost:5000/api/characters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Ninja Ship",
    "type": "Ship",
    "description": "Stealthy and deadly",
    "speed": 7,
    "size": 16,
    "color": "#000000",
    "isUnlocked": false,
    "unlockScore": 50000
  }'
```

### Update Character (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/characters/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "id": 5,
    "name": "Ninja Ship Updated",
    "type": "Ship",
    "description": "Even stealthier",
    "speed": 8,
    "size": 15,
    "color": "#111111",
    "isUnlocked": true,
    "unlockScore": 40000
  }'
```

### Delete Character (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/characters/5 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 5. Items (Power-ups & Obstacles)

### Get All Items
```bash
curl http://localhost:5000/api/items
```

### Get Items by Type
```bash
# Get all power-ups
curl http://localhost:5000/api/items/type/PowerUp

# Get all obstacles
curl http://localhost:5000/api/items/type/Obstacle
```

### Get Item by ID
```bash
curl http://localhost:5000/api/items/1
```

### Create Item (Admin Only)
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Super Shield",
    "type": "PowerUp",
    "description": "Extended invincibility",
    "effect": "invincible",
    "value": 10,
    "color": "#4169e1",
    "rarity": 5
  }'
```

### Update Item (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/items/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "id": 7,
    "name": "Mega Shield",
    "type": "PowerUp",
    "description": "Maximum invincibility",
    "effect": "invincible",
    "value": 15,
    "color": "#0000ff",
    "rarity": 5
  }'
```

### Delete Item (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/items/7 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Complete Workflow Example

### 1. Register and Play
```bash
# Register
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newplayer",
    "email": "new@example.com",
    "playerName": "New Player",
    "password": "secure123"
  }')

# Extract token
TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Get my stats
curl http://localhost:5000/api/players/me \
  -H "Authorization: Bearer $TOKEN"

# Submit a score
curl -X POST http://localhost:5000/api/gamescores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 18500,
    "level": 18,
    "duration": 240,
    "obstaclesDodged": 185,
    "powerUpsCollected": 8,
    "difficulty": "Normal"
  }'

# Check leaderboard
curl http://localhost:5000/api/gamescores/leaderboard/alltime?limit=5
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Username already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid username or password"
}
```

### 403 Forbidden
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.3",
  "title": "Forbidden",
  "status": 403
}
```

### 404 Not Found
```json
{
  "message": "Player not found"
}
```

## Notes

- **JWT tokens expire after 24 hours**
- **Admin credentials**: username: `admin`, password: `admin123`
- **All authenticated endpoints** require `Authorization: Bearer {token}` header
- **Admin-only endpoints** return 403 Forbidden if accessed by regular users
- **Scores are automatically ranked**: Beginner → Novice → Intermediate → Advanced → Expert → Master → Legend
- **Database** is automatically created on first run (spacedodger.db)

## Testing with Swagger

Visit `http://localhost:5000/swagger` for interactive API documentation and testing interface.
