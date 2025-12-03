namespace SpaceDodgerAPI.Models;

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "PowerUp"; // PowerUp, Obstacle, etc.
    public string Description { get; set; } = string.Empty;
    public string Effect { get; set; } = string.Empty;
    public int Value { get; set; } = 0;
    public string Color { get; set; } = "#ffeb3b";
    public int Rarity { get; set; } = 1; // 1-5 scale
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
