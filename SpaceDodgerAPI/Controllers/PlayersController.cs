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
[Authorize]
public class PlayersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PlayersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/players
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
    {
        return await _context.Players.ToListAsync();
    }

    // GET: api/players/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PlayerStatsResponse>> GetPlayer(int id)
    {
        var player = await _context.Players.FindAsync(id);

        if (player == null)
        {
            return NotFound(new { message = "Player not found" });
        }

        // Check authorization (users can only view their own profile unless admin)
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var isAdmin = User.IsInRole("Admin");
        
        if (!isAdmin && player.UserId != userId)
        {
            return Forbid();
        }

        return Ok(new PlayerStatsResponse
        {
            PlayerId = player.Id,
            PlayerName = player.PlayerName,
            TotalGamesPlayed = player.TotalGamesPlayed,
            HighestScore = player.HighestScore,
            TotalScore = player.TotalScore,
            AverageScore = player.GetAverageScore(),
            Rank = player.Rank,
            DateRegistered = player.DateRegistered,
            LastPlayed = player.LastPlayed
        });
    }

    // GET: api/players/me
    [HttpGet("me")]
    public async Task<ActionResult<PlayerStatsResponse>> GetCurrentPlayer()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var player = await _context.Players.FirstOrDefaultAsync(p => p.UserId == userId);

        if (player == null)
        {
            return NotFound(new { message = "Player profile not found" });
        }

        return Ok(new PlayerStatsResponse
        {
            PlayerId = player.Id,
            PlayerName = player.PlayerName,
            TotalGamesPlayed = player.TotalGamesPlayed,
            HighestScore = player.HighestScore,
            TotalScore = player.TotalScore,
            AverageScore = player.GetAverageScore(),
            Rank = player.Rank,
            DateRegistered = player.DateRegistered,
            LastPlayed = player.LastPlayed
        });
    }

    // PUT: api/players/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlayer(int id, Player player)
    {
        if (id != player.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var isAdmin = User.IsInRole("Admin");
        
        if (!isAdmin && player.UserId != userId)
        {
            return Forbid();
        }

        _context.Entry(player).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PlayerExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/players/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePlayer(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
        {
            return NotFound();
        }

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PlayerExists(int id)
    {
        return _context.Players.Any(e => e.Id == id);
    }
}
