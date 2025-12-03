namespace SpaceDodgerAPI.Models;

public class Player
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public int TotalGamesPlayed { get; set; } = 0;
    public int HighestScore { get; set; } = 0;
    public int TotalScore { get; set; } = 0;
    public DateTime DateRegistered { get; set; } = DateTime.UtcNow;
    public DateTime LastPlayed { get; set; } = DateTime.UtcNow;
    public string Rank { get; set; } = "Beginner";
    
    // Navigation property
    public User? User { get; set; }
    public ICollection<GameScore>? GameScores { get; set; }
    
    public double GetAverageScore()
    {
        return TotalGamesPlayed > 0 ? (double)TotalScore / TotalGamesPlayed : 0;
    }
}
