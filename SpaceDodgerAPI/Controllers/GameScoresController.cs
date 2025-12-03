using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceDodgerAPI.Data;
using SpaceDodgerAPI.DTOs;
using SpaceDodgerAPI.Models;
using System.Security.Claims;

namespace SpaceDodgerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameScoresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GameScoresController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/gamescores
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<GameScore>> SubmitScore(SubmitScoreRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var player = await _context.Players.FirstOrDefaultAsync(p => p.UserId == userId);

        if (player == null)
        {
            return NotFound(new { message = "Player profile not found" });
        }

        // Check if this is a new high score
        bool isNewHighScore = request.Score > player.HighestScore;

        // Create game score record
        var gameScore = new GameScore
        {
            PlayerId = player.Id,
            Score = request.Score,
            Level = request.Level,
            Duration = request.Duration,
            ObstaclesDodged = request.ObstaclesDodged,
            PowerUpsCollected = request.PowerUpsCollected,
            NewHighScore = isNewHighScore,
            Difficulty = request.Difficulty,
            PlayedAt = DateTime.UtcNow
        };

        _context.GameScores.Add(gameScore);

        // Update player stats
        player.TotalGamesPlayed++;
        player.TotalScore += request.Score;
        player.LastPlayed = DateTime.UtcNow;

        if (isNewHighScore)
        {
            player.HighestScore = request.Score;
        }

        // Update rank based on high score
        player.Rank = CalculateRank(player.HighestScore);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGameScore), new { id = gameScore.Id }, gameScore);
    }

    // GET: api/gamescores/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GameScore>> GetGameScore(int id)
    {
        var gameScore = await _context.GameScores
            .Include(g => g.Player)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (gameScore == null)
        {
            return NotFound();
        }

        return gameScore;
    }

    // GET: api/gamescores/player/5
    [HttpGet("player/{playerId}")]
    public async Task<ActionResult<IEnumerable<GameScore>>> GetPlayerScores(int playerId)
    {
        var scores = await _context.GameScores
            .Where(g => g.PlayerId == playerId)
            .OrderByDescending(g => g.PlayedAt)
            .Take(50)
            .ToListAsync();

        return scores;
    }

    // GET: api/gamescores/leaderboard
    [HttpGet("leaderboard")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetLeaderboard([FromQuery] int limit = 100)
    {
        var scores = await _context.GameScores
            .Include(g => g.Player)
            .OrderByDescending(g => g.Score)
            .Take(limit)
            .ToListAsync();

        var leaderboard = scores.Select((g, index) => new LeaderboardEntry
        {
            Rank = index + 1,
            PlayerName = g.Player!.PlayerName,
            Score = g.Score,
            Level = g.Level,
            PlayedAt = g.PlayedAt
        }).ToList();

        return leaderboard;
    }

    // GET: api/gamescores/leaderboard/alltime
    [HttpGet("leaderboard/alltime")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetAllTimeLeaderboard([FromQuery] int limit = 100)
    {
        var players = await _context.Players
            .OrderByDescending(p => p.HighestScore)
            .Take(limit)
            .ToListAsync();

        var leaderboard = players.Select((p, index) => new LeaderboardEntry
        {
            Rank = index + 1,
            PlayerName = p.PlayerName,
            Score = p.HighestScore,
            Level = 0,
            PlayedAt = p.LastPlayed
        }).ToList();

        return leaderboard;
    }

    // GET: api/gamescores/my-scores
    [HttpGet("my-scores")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GameScore>>> GetMyScores()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var player = await _context.Players.FirstOrDefaultAsync(p => p.UserId == userId);

        if (player == null)
        {
            return NotFound(new { message = "Player profile not found" });
        }

        var scores = await _context.GameScores
            .Where(g => g.PlayerId == player.Id)
            .OrderByDescending(g => g.PlayedAt)
            .Take(50)
            .ToListAsync();

        return scores;
    }

    // DELETE: api/gamescores/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGameScore(int id)
    {
        var gameScore = await _context.GameScores.FindAsync(id);
        if (gameScore == null)
        {
            return NotFound();
        }

        _context.GameScores.Remove(gameScore);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private string CalculateRank(int highScore)
    {
        return highScore switch
        {
            < 1000 => "Beginner",
            < 5000 => "Novice",
            < 10000 => "Intermediate",
            < 20000 => "Advanced",
            < 50000 => "Expert",
            < 100000 => "Master",
            _ => "Legend"
        };
    }
}
