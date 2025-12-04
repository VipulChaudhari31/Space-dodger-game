// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Game Variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const levelDisplay = document.getElementById("level");

let player, obstacles, score, highScore, gameOver, level, gameStartTime;
const PLAYER_SIZE = 25;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 30;
let keys = {};
let stars = [];
let isGuestMode = false;
let particles = [];
let engineParticles = [];
let asteroidRotations = new Map();
let animationFrame = 0;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
document.getElementById("restartBtn").onclick = startGame;

// ============ Authentication Functions ============

function showLogin() {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'flex';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    if (!username || !password) {
        errorElement.textContent = 'Please fill in all fields';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(data));
            
            // Redirect admin to admin panel
            if (data.role === 'Admin') {
                window.location.href = 'admin.html';
                return;
            }
            
            await loadPlayerStats();
            showGameSection();
            errorElement.textContent = '';
        } else {
            const error = await response.json();
            errorElement.textContent = error.message || 'Login failed';
        }
    } catch (error) {
        errorElement.textContent = 'Connection error. Make sure API is running.';
        console.error('Login error:', error);
    }
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const playerName = document.getElementById('registerPlayerName').value;
    const password = document.getElementById('registerPassword').value;
    const errorElement = document.getElementById('registerError');

    if (!username || !email || !playerName || !password) {
        errorElement.textContent = 'Please fill in all fields';
        return;
    }

    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, playerName, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(data));
            
            // Redirect admin to admin panel (though admins shouldn't register)
            if (data.role === 'Admin') {
                window.location.href = 'admin.html';
                return;
            }
            
            await loadPlayerStats();
            showGameSection();
            errorElement.textContent = '';
        } else {
            const error = await response.json();
            errorElement.textContent = error.message || 'Registration failed';
        }
    } catch (error) {
        errorElement.textContent = 'Connection error. Make sure API is running.';
        console.error('Registration error:', error);
    }
}

function playAsGuest() {
    isGuestMode = true;
    currentUser = { playerName: 'Guest', playerId: null };
    highScore = parseInt(localStorage.getItem("dodgerHighScore")) || 0;
    showGameSection();
}

function logout() {
    authToken = null;
    currentUser = null;
    isGuestMode = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('gameSection').style.display = 'none';
    
    // Clear forms
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPlayerName').value = '';
    document.getElementById('registerPassword').value = '';
}

function showGameSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('playerName').textContent = currentUser.playerName || 'Guest';
        
        // Show admin button if user is admin
        if (currentUser.role === 'Admin') {
            const playerInfo = document.querySelector('.player-info');
            const adminBtn = document.createElement('button');
            adminBtn.textContent = '⚙️ Admin Panel';
            adminBtn.className = 'admin-panel-btn';
            adminBtn.onclick = () => window.location.href = 'admin.html';
            adminBtn.style.cssText = 'background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); border-color: #ba68c8;';
            playerInfo.appendChild(adminBtn);
        }
    }
    
    startGame();
}

async function loadPlayerStats() {
    if (!authToken || isGuestMode) return;

    try {
        const response = await fetch(`${API_URL}/players/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('playerName').textContent = stats.playerName;
            document.getElementById('playerHighScore').textContent = stats.highestScore;
            document.getElementById('gamesPlayed').textContent = stats.totalGamesPlayed;
            document.getElementById('playerRank').textContent = stats.rank;
            highScore = stats.highestScore;
            highScoreDisplay.textContent = highScore;
        }
    } catch (error) {
        console.error('Error loading player stats:', error);
    }
}

// ============ Game Functions ============

function startGame() {
    player = {
        x: canvas.width / 2 - PLAYER_SIZE / 2,
        y: canvas.height - 50,
        speed: 4,
        size: PLAYER_SIZE,
        angle: 0,
        targetAngle: 0
    };

    obstacles = [];
    particles = [];
    engineParticles = [];
    asteroidRotations.clear();
    animationFrame = 0;
    score = 0;
    level = 1;
    gameOver = false;
    gameStartTime = Date.now();

    if (!isGuestMode && authToken) {
        // Load high score from user stats
        highScore = parseInt(document.getElementById('playerHighScore').textContent) || 0;
    } else {
        highScore = parseInt(localStorage.getItem("dodgerHighScore")) || 0;
    }
    
    highScoreDisplay.textContent = highScore;
    levelDisplay.textContent = level;
       
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5,
            brightness: 0.3 + Math.random() * 0.7,
            twinkleSpeed: 0.02 + Math.random() * 0.03
        });
    }

    requestAnimationFrame(update);
}

function spawnObstacle() {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel !== level) {
        level = newLevel;
        levelDisplay.textContent = level;
    }
    
    const baseSpeed = 2;
    const speedIncrease = (level - 1) * 0.5;
    const currentSpeed = baseSpeed + speedIncrease;
    
    const obstacleId = Date.now() + Math.random();
    const obstacle = {
        id: obstacleId,
        x: Math.random() * (canvas.width - OBSTACLE_WIDTH),
        y: -OBSTACLE_HEIGHT,
        speed: currentSpeed,
        size: OBSTACLE_WIDTH * (0.8 + Math.random() * 0.4),
        type: Math.random() > 0.7 ? 'large' : 'normal'
    };
    
    asteroidRotations.set(obstacleId, {
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
    });
    
    obstacles.push(obstacle);
}

function movePlayer() {
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.size) {
        player.x += player.speed;
    }
    if (keys["ArrowUp"] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys["ArrowDown"] && player.y < canvas.height - player.size) {
        player.y += player.speed;
    }
}

function drawPlayer() {
    const centerX = player.x + player.size / 2;
    const centerY = player.y + player.size / 2;
    
    // Create engine particles
    if (Math.random() > 0.3) {
        engineParticles.push({
            x: centerX + (Math.random() - 0.5) * 8,
            y: player.y + player.size - 2,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            life: 1.0,
            size: Math.random() * 3 + 2
        });
    }
    
    // Draw engine glow
    ctx.save();
    ctx.globalAlpha = 0.6;
    const glowGradient = ctx.createRadialGradient(centerX, player.y + player.size, 0, centerX, player.y + player.size, 15);
    glowGradient.addColorStop(0, '#00bcd4');
    glowGradient.addColorStop(0.5, '#0097a7');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(centerX - 15, player.y + player.size - 5, 30, 20);
    ctx.restore();
    
    // Draw ship body with gradient
    const bodyGradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.size);
    bodyGradient.addColorStop(0, '#00e676');
    bodyGradient.addColorStop(0.5, '#00c853');
    bodyGradient.addColorStop(1, '#00a344');
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(centerX, player.y);
    ctx.lineTo(player.x + 5, player.y + player.size * 0.7);
    ctx.lineTo(player.x, player.y + player.size);
    ctx.lineTo(centerX, player.y + player.size - 5);
    ctx.lineTo(player.x + player.size, player.y + player.size);
    ctx.lineTo(player.x + player.size - 5, player.y + player.size * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Add ship outline
    ctx.strokeStyle = '#76ff03';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw cockpit
    ctx.fillStyle = '#00bcd4';
    ctx.beginPath();
    ctx.ellipse(centerX, player.y + player.size * 0.3, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add cockpit glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00bcd4';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw wing details
    ctx.strokeStyle = '#76ff03';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(player.x + 8, player.y + player.size * 0.5);
    ctx.lineTo(player.x + 3, player.y + player.size * 0.65);
    ctx.moveTo(player.x + player.size - 8, player.y + player.size * 0.5);
    ctx.lineTo(player.x + player.size - 3, player.y + player.size * 0.65);
    ctx.stroke();
}

function drawObstacle(o) {
    const cx = o.x + o.size / 2;
    const cy = o.y + o.size / 2;
    const rotation = asteroidRotations.get(o.id);
    
    if (rotation) {
        rotation.angle += rotation.rotationSpeed;
    }
    
    ctx.save();
    ctx.translate(cx, cy);
    if (rotation) ctx.rotate(rotation.angle);
    
    // Create asteroid glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff1744';
    
    // Draw main asteroid body with gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, o.size / 2);
    if (o.type === 'large') {
        gradient.addColorStop(0, '#ff5252');
        gradient.addColorStop(0.4, '#ff1744');
        gradient.addColorStop(0.7, '#d32f2f');
        gradient.addColorStop(1, '#b71c1c');
    } else {
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, '#ff1744');
        gradient.addColorStop(1, '#c41c3b');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    const points = o.type === 'large' ? 8 : 7;
    const irregularity = o.type === 'large' ? 0.5 : 0.4;
    
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const randomRadius = (o.size / 2) * (0.7 + Math.random() * irregularity);
        const x = Math.cos(angle) * randomRadius;
        const y = Math.sin(angle) * randomRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add darker craters
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(139, 28, 28, 0.6)';
    
    const craterCount = o.type === 'large' ? 4 : 3;
    for (let i = 0; i < craterCount; i++) {
        const craterAngle = (i / craterCount) * Math.PI * 2 + rotation.angle;
        const craterDist = (o.size / 2) * 0.4;
        const craterX = Math.cos(craterAngle) * craterDist;
        const craterY = Math.sin(craterAngle) * craterDist;
        const craterSize = o.size * 0.15;
        
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 82, 82, 0.4)';
    ctx.beginPath();
    ctx.arc(-o.size * 0.15, -o.size * 0.15, o.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Add particle trail
    if (Math.random() > 0.7) {
        particles.push({
            x: cx + (Math.random() - 0.5) * o.size,
            y: cy,
            vx: (Math.random() - 0.5) * 1,
            vy: -o.speed * 0.3,
            life: 1.0,
            size: Math.random() * 2 + 1,
            color: '#ff1744'
        });
    }
}

function checkCollision(a, b) {
    const buffer = 5; // Slightly more forgiving hitbox
    return (
        a.x + buffer < b.x + b.size &&
        a.x + a.size - buffer > b.x &&
        a.y + buffer < b.y + b.size &&
        a.y + a.size - buffer > b.y
    );
}

// Create explosion effect
function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = 2 + Math.random() * 3;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            size: 3 + Math.random() * 3,
            color: i % 3 === 0 ? '#ffeb3b' : (i % 3 === 1 ? '#ff9800' : '#ff5722')
        });
    }
}

let spawnTimer = 0;

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame++;
    
    // Draw enhanced stars with twinkling effect
    for (let star of stars) {
        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0.3) {
            star.twinkleSpeed *= -1;
        }
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add star glow
        if (star.size > 1.5 && star.brightness > 0.7) {
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#ffffff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Update and draw engine particles
    for (let i = engineParticles.length - 1; i >= 0; i--) {
        const p = engineParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        
        if (p.life <= 0) {
            engineParticles.splice(i, 1);
            continue;
        }
        
        const alpha = p.life * 0.8;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(0, 188, 212, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(0, 151, 167, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Update and draw obstacle particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        ctx.fillStyle = `rgba(255, 23, 68, ${p.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
    }

    movePlayer();
    drawPlayer();

    spawnTimer++;
    if (spawnTimer > 45) { 
        spawnObstacle();
        spawnTimer = 0;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.y += o.speed;

        drawObstacle(o);

        if (o.y > canvas.height) {
            asteroidRotations.delete(o.id);
            obstacles.splice(i, 1);
        }

        if (checkCollision(player, o)) {
            gameOver = true;
            createExplosion(player.x + player.size / 2, player.y + player.size / 2);
            handleGameOver();
        }
    }

    score++;
    scoreDisplay.textContent = score;

    requestAnimationFrame(update);
}

async function handleGameOver() {
    // Draw semi-transparent overlay with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.7)");
    gradient.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw "GAME OVER" with glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff1744';
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    
    // Draw score info
    ctx.fillStyle = "#00e676";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = "#00bcd4";
    ctx.font = "20px Arial";
    ctx.fillText(`Level Reached: ${level}`, canvas.width / 2, canvas.height / 2 + 30);

    const duration = Math.floor((Date.now() - gameStartTime) / 1000);
    const obstaclesDodged = Math.floor(score / 10);

    // Submit score to API if logged in
    if (!isGuestMode && authToken) {
        await submitScore(score, level, duration, obstaclesDodged);
        await loadPlayerStats(); // Refresh player stats
    } else {
        // Update local high score for guest mode
        if (score > highScore) {
            localStorage.setItem("dodgerHighScore", score);
            highScoreDisplay.textContent = score;
        }
    }
}

async function submitScore(finalScore, finalLevel, duration, obstaclesDodged) {
    try {
        const response = await fetch(`${API_URL}/gamescores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                score: finalScore,
                level: finalLevel,
                duration: duration,
                obstaclesDodged: obstaclesDodged,
                powerUpsCollected: 0,
                difficulty: 'Normal'
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.newHighScore) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00e676';
                ctx.fillStyle = "#00e676";
                ctx.font = "bold 22px Arial";
                ctx.fillText("🏆 NEW HIGH SCORE! 🏆", canvas.width / 2, canvas.height / 2 + 65);
                ctx.shadowBlur = 0;
            }
        }
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

// ============ Leaderboard Functions ============

async function showLeaderboard() {
    document.getElementById('leaderboardModal').style.display = 'block';
    await showAllTimeLeaderboard();
}

function closeLeaderboard() {
    document.getElementById('leaderboardModal').style.display = 'none';
}

async function showAllTimeLeaderboard() {
    const content = document.getElementById('leaderboardContent');
    content.innerHTML = '<p>Loading...</p>';
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.leaderboard-tabs .tab-btn');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');

    try {
        const response = await fetch(`${API_URL}/gamescores/leaderboard/alltime?limit=20`);
        
        if (response.ok) {
            const leaderboard = await response.json();
            displayLeaderboard(leaderboard, content);
        } else {
            content.innerHTML = '<p>Failed to load leaderboard</p>';
        }
    } catch (error) {
        content.innerHTML = '<p>Connection error. Make sure API is running.</p>';
        console.error('Error loading leaderboard:', error);
    }
}

async function showRecentLeaderboard() {
    const content = document.getElementById('leaderboardContent');
    content.innerHTML = '<p>Loading...</p>';
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.leaderboard-tabs .tab-btn');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');

    try {
        const response = await fetch(`${API_URL}/gamescores/leaderboard?limit=20`);
        
        if (response.ok) {
            const leaderboard = await response.json();
            displayLeaderboard(leaderboard, content, true);
        } else {
            content.innerHTML = '<p>Failed to load leaderboard</p>';
        }
    } catch (error) {
        content.innerHTML = '<p>Connection error. Make sure API is running.</p>';
        console.error('Error loading leaderboard:', error);
    }
}

function displayLeaderboard(data, container, showDate = false) {
    if (data.length === 0) {
        container.innerHTML = '<p>No scores yet. Be the first!</p>';
        return;
    }

    let html = '<table class="leaderboard-table"><thead><tr>';
    html += '<th>Rank</th><th>Player</th><th>Score</th><th>Level</th>';
    if (showDate) html += '<th>Date</th>';
    html += '</tr></thead><tbody>';

    data.forEach(entry => {
        const rankClass = entry.rank <= 3 ? `rank-${entry.rank}` : '';
        const date = showDate ? new Date(entry.playedAt).toLocaleDateString() : '';
        
        html += `<tr>
            <td class="${rankClass}">${entry.rank}</td>
            <td>${entry.playerName}</td>
            <td>${entry.score.toLocaleString()}</td>
            <td>${entry.level || '-'}</td>
            ${showDate ? `<td>${date}</td>` : ''}
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============ Initialization ============

// Check if user is already logged in
if (authToken && currentUser) {
    // Redirect admin to admin panel
    if (currentUser.role === 'Admin') {
        window.location.href = 'admin.html';
    } else {
        loadPlayerStats().then(() => {
            showGameSection();
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('leaderboardModal');
    if (event.target == modal) {
        closeLeaderboard();
    }
}

// Handle Enter key in login/register forms
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

document.getElementById('registerPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});
