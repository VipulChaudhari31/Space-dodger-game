using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceDodgerAPI.Data;
using SpaceDodgerAPI.Models;

namespace SpaceDodgerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CharactersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/characters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        return await _context.Characters.ToListAsync();
    }

    // GET: api/characters/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);

        if (character == null)
        {
            return NotFound();
        }

        return character;
    }

    // POST: api/characters
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Character>> CreateCharacter(Character character)
    {
        _context.Characters.Add(character);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCharacter), new { id = character.Id }, character);
    }

    // PUT: api/characters/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCharacter(int id, Character character)
    {
        if (id != character.Id)
        {
            return BadRequest();
        }

        _context.Entry(character).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CharacterExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/characters/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);
        if (character == null)
        {
            return NotFound();
        }

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CharacterExists(int id)
    {
        return _context.Characters.Any(e => e.Id == id);
    }
}
