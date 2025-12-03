namespace SpaceDodgerAPI.Models;

public class GameScore
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public int Score { get; set; }
    public int Level { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
    public int Duration { get; set; } // Duration in seconds
    public int ObstaclesDodged { get; set; } = 0;
    public int PowerUpsCollected { get; set; } = 0;
    public bool NewHighScore { get; set; } = false;
    public string Difficulty { get; set; } = "Normal";
    
    // Navigation property
    public Player? Player { get; set; }
}
