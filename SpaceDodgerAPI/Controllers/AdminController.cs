using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceDodgerAPI.Data;
using SpaceDodgerAPI.Models;

namespace SpaceDodgerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ============ Users Management ============
    
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.CreatedAt,
                u.IsActive
            })
            .ToListAsync();
        
        return Ok(users);
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (!string.IsNullOrEmpty(dto.Email))
            user.Email = dto.Email;
        if (!string.IsNullOrEmpty(dto.Role))
            user.Role = dto.Role;
        if (dto.IsActive.HasValue)
            user.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(new { message = "User updated successfully" });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (user.Username == "admin")
            return BadRequest(new { message = "Cannot delete admin user" });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deleted successfully" });
    }

    // ============ Players Management ============
    
    [HttpGet("players")]
    public async Task<ActionResult<IEnumerable<Player>>> GetAllPlayers()
    {
        var players = await _context.Players
            .Include(p => p.User)
            .ToListAsync();
        
        return Ok(players);
    }

    [HttpGet("players/{id}")]
    public async Task<ActionResult<Player>> GetPlayer(int id)
    {
        var player = await _context.Players
            .Include(p => p.User)
            .Include(p => p.GameScores)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null)
            return NotFound();

        return Ok(player);
    }

    [HttpPut("players/{id}")]
    public async Task<IActionResult> UpdatePlayer(int id, [FromBody] PlayerUpdateDto dto)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
            return NotFound(new { message = "Player not found" });

        if (!string.IsNullOrEmpty(dto.PlayerName))
            player.PlayerName = dto.PlayerName;
        if (dto.HighestScore.HasValue)
            player.HighestScore = dto.HighestScore.Value;
        if (!string.IsNullOrEmpty(dto.Rank))
            player.Rank = dto.Rank;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Player updated successfully" });
    }

    [HttpDelete("players/{id}")]
    public async Task<IActionResult> DeletePlayer(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
            return NotFound(new { message = "Player not found" });

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Player deleted successfully" });
    }

    // ============ GameScores Management ============
    
    [HttpGet("gamescores")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllGameScores([FromQuery] int? playerId)
    {
        var query = _context.GameScores
            .Include(gs => gs.Player)
            .AsQueryable();

        if (playerId.HasValue)
            query = query.Where(gs => gs.PlayerId == playerId.Value);

        var scores = await query
            .OrderByDescending(gs => gs.PlayedAt)
            .Select(gs => new
            {
                gs.Id,
                gs.PlayerId,
                PlayerName = gs.Player.PlayerName,
                gs.Score,
                gs.Level,
                gs.Duration,
                gs.ObstaclesDodged,
                gs.PowerUpsCollected,
                gs.Difficulty,
                gs.PlayedAt
            })
            .ToListAsync();

        return Ok(scores);
    }

    [HttpDelete("gamescores/{id}")]
    public async Task<IActionResult> DeleteGameScore(int id)
    {
        var score = await _context.GameScores.FindAsync(id);
        if (score == null)
            return NotFound(new { message = "Game score not found" });

        _context.GameScores.Remove(score);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Game score deleted successfully" });
    }

    // ============ Characters Management ============
    
    [HttpGet("characters")]
    public async Task<ActionResult<IEnumerable<Character>>> GetAllCharacters()
    {
        return await _context.Characters.ToListAsync();
    }

    [HttpPost("characters")]
    public async Task<ActionResult<Character>> CreateCharacter([FromBody] CharacterDto dto)
    {
        var character = new Character
        {
            Name = dto.Name,
            Type = dto.Type,
            Description = dto.Description,
            Speed = dto.Speed,
            Size = dto.Size,
            Color = dto.Color,
            IsUnlocked = dto.IsUnlocked,
            UnlockScore = dto.UnlockScore
        };

        _context.Characters.Add(character);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllCharacters), new { id = character.Id }, character);
    }

    [HttpPut("characters/{id}")]
    public async Task<IActionResult> UpdateCharacter(int id, [FromBody] CharacterDto dto)
    {
        var character = await _context.Characters.FindAsync(id);
        if (character == null)
            return NotFound(new { message = "Character not found" });

        character.Name = dto.Name;
        character.Type = dto.Type;
        character.Description = dto.Description;
        character.Speed = dto.Speed;
        character.Size = dto.Size;
        character.Color = dto.Color;
        character.IsUnlocked = dto.IsUnlocked;
        character.UnlockScore = dto.UnlockScore;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Character updated successfully" });
    }

    [HttpDelete("characters/{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);
        if (character == null)
            return NotFound(new { message = "Character not found" });

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Character deleted successfully" });
    }

    // ============ Items Management ============
    
    [HttpGet("items")]
    public async Task<ActionResult<IEnumerable<Item>>> GetAllItems()
    {
        return await _context.Items.ToListAsync();
    }

    [HttpPost("items")]
    public async Task<ActionResult<Item>> CreateItem([FromBody] ItemDto dto)
    {
        var item = new Item
        {
            Name = dto.Name,
            Type = dto.Type,
            Description = dto.Description,
            Effect = dto.Effect,
            Value = dto.Value,
            Color = dto.Color,
            Rarity = dto.Rarity
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllItems), new { id = item.Id }, item);
    }

    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemDto dto)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
            return NotFound(new { message = "Item not found" });

        item.Name = dto.Name;
        item.Type = dto.Type;
        item.Description = dto.Description;
        item.Effect = dto.Effect;
        item.Value = dto.Value;
        item.Color = dto.Color;
        item.Rarity = dto.Rarity;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Item updated successfully" });
    }

    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
            return NotFound(new { message = "Item not found" });

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Item deleted successfully" });
    }

    // ============ Statistics ============
    
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStatistics()
    {
        var stats = new
        {
            TotalUsers = await _context.Users.CountAsync(),
            ActiveUsers = await _context.Users.CountAsync(u => u.IsActive),
            TotalPlayers = await _context.Players.CountAsync(),
            TotalGames = await _context.GameScores.CountAsync(),
            TotalCharacters = await _context.Characters.CountAsync(),
            TotalItems = await _context.Items.CountAsync(),
            HighestScore = await _context.GameScores.MaxAsync(gs => (int?)gs.Score) ?? 0,
            AverageScore = await _context.GameScores.AverageAsync(gs => (double?)gs.Score) ?? 0
        };

        return Ok(stats);
    }
}

// DTOs
public class UserUpdateDto
{
    public string? Email { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
}

public class PlayerUpdateDto
{
    public string? PlayerName { get; set; }
    public int? HighestScore { get; set; }
    public string? Rank { get; set; }
}

public class CharacterDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Speed { get; set; }
    public int Size { get; set; }
    public string Color { get; set; } = string.Empty;
    public bool IsUnlocked { get; set; }
    public int UnlockScore { get; set; }
}

public class ItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Effect { get; set; } = string.Empty;
    public int Value { get; set; }
    public string Color { get; set; } = string.Empty;
    public int Rarity { get; set; }
}
