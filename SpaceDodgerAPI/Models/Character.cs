namespace SpaceDodgerAPI.Models;

public class Character
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Ship"; // Ship, Alien, etc.
    public string Description { get; set; } = string.Empty;
    public int Speed { get; set; } = 4;
    public int Size { get; set; } = 20;
    public string Color { get; set; } = "#00e676";
    public bool IsUnlocked { get; set; } = false;
    public int UnlockScore { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
