// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Check if user is admin
if (!currentUser || currentUser.role !== 'Admin') {
    alert('Access denied. Admin privileges required.');
    window.location.href = 'index.html';
}

document.getElementById('adminUsername').textContent = currentUser.username || 'Admin';

// Initialize
loadStatistics();
loadUsers();

// ============ Tab Management ============

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    refreshData(tabName);
}

function refreshData(entity) {
    switch (entity) {
        case 'users':
            loadUsers();
            break;
        case 'players':
            loadPlayers();
            break;
        case 'gamescores':
            loadGameScores();
            break;
        case 'characters':
            loadCharacters();
            break;
        case 'items':
            loadItems();
            break;
    }
    loadStatistics();
}

// ============ Statistics ============

async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalUsers').textContent = stats.totalUsers;
            document.getElementById('activeUsers').textContent = stats.activeUsers;
            document.getElementById('totalPlayers').textContent = stats.totalPlayers;
            document.getElementById('totalGames').textContent = stats.totalGames;
            document.getElementById('totalCharacters').textContent = stats.totalCharacters;
            document.getElementById('totalItems').textContent = stats.totalItems;
            document.getElementById('highestScore').textContent = stats.highestScore.toLocaleString();
            document.getElementById('averageScore').textContent = Math.round(stats.averageScore).toLocaleString();
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// ============ Users Management ============

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td class="${user.isActive ? 'status-active' : 'status-inactive'}">
                        ${user.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                        <button class="btn-primary btn-small" onclick="editUser(${user.id})">Edit</button>
                        ${user.username !== 'admin' ? `<button class="btn-danger btn-small" onclick="deleteUser(${user.id})">Delete</button>` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function editUser(id) {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            const user = users.find(u => u.id === id);

            if (user) {
                showModal('Edit User', `
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editEmail" value="${user.email}">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="editRole">
                            <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                            <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editIsActive">
                            <option value="true" ${user.isActive ? 'selected' : ''}>Active</option>
                            <option value="false" ${!user.isActive ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button class="btn-success" onclick="saveUser(${id})">Save</button>
                    </div>
                `);
            }
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function saveUser(id) {
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;
    const isActive = document.getElementById('editIsActive').value === 'true';

    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ email, role, isActive })
        });

        if (response.ok) {
            closeModal();
            loadUsers();
            alert('User updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadUsers();
            loadStatistics();
            alert('User deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

// ============ Players Management ============

async function loadPlayers() {
    try {
        const response = await fetch(`${API_URL}/admin/players`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const players = await response.json();
            const tbody = document.getElementById('playersTableBody');
            tbody.innerHTML = '';

            players.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.id}</td>
                    <td>${player.playerName}</td>
                    <td>${player.userId}</td>
                    <td>${player.highestScore.toLocaleString()}</td>
                    <td>${player.totalGamesPlayed}</td>
                    <td>${player.rank}</td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deletePlayer(${player.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

async function editPlayer(id) {
    try {
        const response = await fetch(`${API_URL}/admin/players/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const player = await response.json();

            showModal('Edit Player', `
                <div class="form-group">
                    <label>Player Name</label>
                    <input type="text" id="editPlayerName" value="${player.playerName}">
                </div>
                <div class="form-group">
                    <label>Highest Score</label>
                    <input type="number" id="editHighestScore" value="${player.highestScore}">
                </div>
                <div class="form-group">
                    <label>Rank</label>
                    <input type="text" id="editRank" value="${player.rank}">
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn-success" onclick="savePlayer(${id})">Save</button>
                </div>
            `);
        }
    } catch (error) {
        console.error('Error loading player:', error);
    }
}

async function savePlayer(id) {
    const playerName = document.getElementById('editPlayerName').value;
    const highestScore = parseInt(document.getElementById('editHighestScore').value);
    const rank = document.getElementById('editRank').value;

    try {
        const response = await fetch(`${API_URL}/admin/players/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ playerName, highestScore, rank })
        });

        if (response.ok) {
            closeModal();
            loadPlayers();
            alert('Player updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update player');
        }
    } catch (error) {
        console.error('Error updating player:', error);
        alert('Error updating player');
    }
}

async function deletePlayer(id) {
    if (!confirm('Are you sure you want to delete this player? This will also delete all their game scores.')) return;

    try {
        const response = await fetch(`${API_URL}/admin/players/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadPlayers();
            loadStatistics();
            alert('Player deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete player');
        }
    } catch (error) {
        console.error('Error deleting player:', error);
        alert('Error deleting player');
    }
}

// ============ Game Scores Management ============

async function loadGameScores() {
    try {
        const response = await fetch(`${API_URL}/admin/gamescores`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const scores = await response.json();
            const tbody = document.getElementById('gamescoresTableBody');
            tbody.innerHTML = '';

            scores.forEach(score => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${score.id}</td>
                    <td>${score.playerName}</td>
                    <td>${score.score.toLocaleString()}</td>
                    <td>${score.level || '-'}</td>
                    <td>${score.duration}</td>
                    <td>${score.obstaclesDodged}</td>
                    <td>${score.difficulty}</td>
                    <td>${new Date(score.playedAt).toLocaleString()}</td>
                    <td>
                        <button class="btn-danger btn-small" onclick="deleteGameScore(${score.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading game scores:', error);
    }
}

async function deleteGameScore(id) {
    if (!confirm('Are you sure you want to delete this game score?')) return;

    try {
        const response = await fetch(`${API_URL}/admin/gamescores/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadGameScores();
            loadStatistics();
            alert('Game score deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete game score');
        }
    } catch (error) {
        console.error('Error deleting game score:', error);
        alert('Error deleting game score');
    }
}

// ============ Characters Management ============

async function loadCharacters() {
    try {
        const response = await fetch(`${API_URL}/admin/characters`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const characters = await response.json();
            const tbody = document.getElementById('charactersTableBody');
            tbody.innerHTML = '';

            characters.forEach(character => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${character.id}</td>
                    <td>${character.name}</td>
                    <td>${character.type}</td>
                    <td>${character.description}</td>
                    <td>${character.speed}</td>
                    <td>${character.size}</td>
                    <td><span class="color-preview" style="background-color: ${character.color}"></span> ${character.color}</td>
                    <td class="${character.isUnlocked ? 'status-active' : 'status-inactive'}">
                        ${character.isUnlocked ? 'Yes' : 'No'}
                    </td>
                    <td>${character.unlockScore.toLocaleString()}</td>
                    <td>
                        <button class="btn-primary btn-small" onclick="editCharacter(${character.id})">Edit</button>
                        <button class="btn-danger btn-small" onclick="deleteCharacter(${character.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

function showAddCharacterForm() {
    showModal('Add Character', `
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="charName" placeholder="Enter character name">
        </div>
        <div class="form-group">
            <label>Type</label>
            <input type="text" id="charType" placeholder="e.g., Ship">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="charDescription" placeholder="Enter description"></textarea>
        </div>
        <div class="form-group">
            <label>Speed</label>
            <input type="number" id="charSpeed" value="4" min="1" max="10">
        </div>
        <div class="form-group">
            <label>Size</label>
            <input type="number" id="charSize" value="20" min="10" max="50">
        </div>
        <div class="form-group">
            <label>Color (hex)</label>
            <input type="text" id="charColor" value="#00e676" placeholder="#00e676">
        </div>
        <div class="form-group">
            <label>Unlocked</label>
            <select id="charIsUnlocked">
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        </div>
        <div class="form-group">
            <label>Unlock Score</label>
            <input type="number" id="charUnlockScore" value="0" min="0">
        </div>
        <div class="form-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-success" onclick="addCharacter()">Add</button>
        </div>
    `);
}

async function addCharacter() {
    const data = {
        name: document.getElementById('charName').value,
        type: document.getElementById('charType').value,
        description: document.getElementById('charDescription').value,
        speed: parseInt(document.getElementById('charSpeed').value),
        size: parseInt(document.getElementById('charSize').value),
        color: document.getElementById('charColor').value,
        isUnlocked: document.getElementById('charIsUnlocked').value === 'true',
        unlockScore: parseInt(document.getElementById('charUnlockScore').value)
    };

    try {
        const response = await fetch(`${API_URL}/admin/characters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadCharacters();
            loadStatistics();
            alert('Character added successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to add character');
        }
    } catch (error) {
        console.error('Error adding character:', error);
        alert('Error adding character');
    }
}

async function editCharacter(id) {
    try {
        const response = await fetch(`${API_URL}/admin/characters`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const characters = await response.json();
            const character = characters.find(c => c.id === id);

            if (character) {
                showModal('Edit Character', `
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="charName" value="${character.name}">
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" id="charType" value="${character.type}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="charDescription">${character.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Speed</label>
                        <input type="number" id="charSpeed" value="${character.speed}">
                    </div>
                    <div class="form-group">
                        <label>Size</label>
                        <input type="number" id="charSize" value="${character.size}">
                    </div>
                    <div class="form-group">
                        <label>Color (hex)</label>
                        <input type="text" id="charColor" value="${character.color}">
                    </div>
                    <div class="form-group">
                        <label>Unlocked</label>
                        <select id="charIsUnlocked">
                            <option value="true" ${character.isUnlocked ? 'selected' : ''}>Yes</option>
                            <option value="false" ${!character.isUnlocked ? 'selected' : ''}>No</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Unlock Score</label>
                        <input type="number" id="charUnlockScore" value="${character.unlockScore}">
                    </div>
                    <div class="form-actions">
                        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button class="btn-success" onclick="saveCharacter(${id})">Save</button>
                    </div>
                `);
            }
        }
    } catch (error) {
        console.error('Error loading character:', error);
    }
}

async function saveCharacter(id) {
    const data = {
        name: document.getElementById('charName').value,
        type: document.getElementById('charType').value,
        description: document.getElementById('charDescription').value,
        speed: parseInt(document.getElementById('charSpeed').value),
        size: parseInt(document.getElementById('charSize').value),
        color: document.getElementById('charColor').value,
        isUnlocked: document.getElementById('charIsUnlocked').value === 'true',
        unlockScore: parseInt(document.getElementById('charUnlockScore').value)
    };

    try {
        const response = await fetch(`${API_URL}/admin/characters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadCharacters();
            alert('Character updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update character');
        }
    } catch (error) {
        console.error('Error updating character:', error);
        alert('Error updating character');
    }
}

async function deleteCharacter(id) {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
        const response = await fetch(`${API_URL}/admin/characters/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadCharacters();
            loadStatistics();
            alert('Character deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete character');
        }
    } catch (error) {
        console.error('Error deleting character:', error);
        alert('Error deleting character');
    }
}

// ============ Items Management ============

async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/admin/items`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const items = await response.json();
            const tbody = document.getElementById('itemsTableBody');
            tbody.innerHTML = '';

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.description}</td>
                    <td>${item.effect}</td>
                    <td>${item.value}</td>
                    <td><span class="color-preview" style="background-color: ${item.color}"></span> ${item.color}</td>
                    <td>${item.rarity}</td>
                    <td>
                        <button class="btn-primary btn-small" onclick="editItem(${item.id})">Edit</button>
                        <button class="btn-danger btn-small" onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

function showAddItemForm() {
    showModal('Add Item', `
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="itemName" placeholder="Enter item name">
        </div>
        <div class="form-group">
            <label>Type</label>
            <input type="text" id="itemType" placeholder="e.g., PowerUp, Obstacle">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="itemDescription" placeholder="Enter description"></textarea>
        </div>
        <div class="form-group">
            <label>Effect</label>
            <input type="text" id="itemEffect" placeholder="e.g., speed_boost, damage">
        </div>
        <div class="form-group">
            <label>Value</label>
            <input type="number" id="itemValue" value="1" min="1">
        </div>
        <div class="form-group">
            <label>Color (hex)</label>
            <input type="text" id="itemColor" value="#00e676" placeholder="#00e676">
        </div>
        <div class="form-group">
            <label>Rarity (1-5)</label>
            <input type="number" id="itemRarity" value="1" min="1" max="5">
        </div>
        <div class="form-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-success" onclick="addItem()">Add</button>
        </div>
    `);
}

async function addItem() {
    const data = {
        name: document.getElementById('itemName').value,
        type: document.getElementById('itemType').value,
        description: document.getElementById('itemDescription').value,
        effect: document.getElementById('itemEffect').value,
        value: parseInt(document.getElementById('itemValue').value),
        color: document.getElementById('itemColor').value,
        rarity: parseInt(document.getElementById('itemRarity').value)
    };

    try {
        const response = await fetch(`${API_URL}/admin/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadItems();
            loadStatistics();
            alert('Item added successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item');
    }
}

async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/admin/items`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const items = await response.json();
            const item = items.find(i => i.id === id);

            if (item) {
                showModal('Edit Item', `
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="itemName" value="${item.name}">
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" id="itemType" value="${item.type}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="itemDescription">${item.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Effect</label>
                        <input type="text" id="itemEffect" value="${item.effect}">
                    </div>
                    <div class="form-group">
                        <label>Value</label>
                        <input type="number" id="itemValue" value="${item.value}">
                    </div>
                    <div class="form-group">
                        <label>Color (hex)</label>
                        <input type="text" id="itemColor" value="${item.color}">
                    </div>
                    <div class="form-group">
                        <label>Rarity (1-5)</label>
                        <input type="number" id="itemRarity" value="${item.rarity}">
                    </div>
                    <div class="form-actions">
                        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button class="btn-success" onclick="saveItem(${id})">Save</button>
                    </div>
                `);
            }
        }
    } catch (error) {
        console.error('Error loading item:', error);
    }
}

async function saveItem(id) {
    const data = {
        name: document.getElementById('itemName').value,
        type: document.getElementById('itemType').value,
        description: document.getElementById('itemDescription').value,
        effect: document.getElementById('itemEffect').value,
        value: parseInt(document.getElementById('itemValue').value),
        color: document.getElementById('itemColor').value,
        rarity: parseInt(document.getElementById('itemRarity').value)
    };

    try {
        const response = await fetch(`${API_URL}/admin/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadItems();
            alert('Item updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update item');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item');
    }
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`${API_URL}/admin/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadItems();
            loadStatistics();
            alert('Item deleted successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
    }
}

// ============ Modal Functions ============

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// ============ Utility Functions ============

function backToGame() {
    window.location.href = 'index.html';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
