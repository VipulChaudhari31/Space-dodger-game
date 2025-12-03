namespace SpaceDodgerAPI.DTOs;

public class SubmitScoreRequest
{
    public int Score { get; set; }
    public int Level { get; set; }
    public int Duration { get; set; }
    public int ObstaclesDodged { get; set; }
    public int PowerUpsCollected { get; set; }
    public string Difficulty { get; set; } = "Normal";
}

public class PlayerStatsResponse
{
    public int PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public int TotalGamesPlayed { get; set; }
    public int HighestScore { get; set; }
    public int TotalScore { get; set; }
    public double AverageScore { get; set; }
    public string Rank { get; set; } = string.Empty;
    public DateTime DateRegistered { get; set; }
    public DateTime LastPlayed { get; set; }
}

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public int Score { get; set; }
    public int Level { get; set; }
    public DateTime PlayedAt { get; set; }
}
