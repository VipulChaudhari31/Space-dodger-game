using Microsoft.EntityFrameworkCore;
using SpaceDodgerAPI.Models;

namespace SpaceDodgerAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<GameScore> GameScores { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Item> Items { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).HasMaxLength(20);
        });

        // Configure Player
        modelBuilder.Entity<Player>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.PlayerName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Rank).HasMaxLength(50);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure GameScore
        modelBuilder.Entity<GameScore>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PlayerId);
            entity.HasIndex(e => e.Score);
            entity.Property(e => e.Difficulty).HasMaxLength(20);
            entity.HasOne(e => e.Player)
                  .WithMany(p => p.GameScores)
                  .HasForeignKey(e => e.PlayerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Character
        modelBuilder.Entity<Character>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.Color).HasMaxLength(20);
        });

        // Configure Item
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.Color).HasMaxLength(20);
        });

        // Seed initial data (Characters and Items only - Admin user is created in Program.cs)
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Characters
        modelBuilder.Entity<Character>().HasData(
            new Character { Id = 1, Name = "Basic Ship", Type = "Ship", Description = "Standard space fighter", Speed = 4, Size = 20, Color = "#00e676", IsUnlocked = true, UnlockScore = 0 },
            new Character { Id = 2, Name = "Speed Racer", Type = "Ship", Description = "Fast and agile", Speed = 6, Size = 18, Color = "#00bcd4", IsUnlocked = false, UnlockScore = 5000 },
            new Character { Id = 3, Name = "Tank", Type = "Ship", Description = "Slow but larger hit box", Speed = 3, Size = 25, Color = "#ff9800", IsUnlocked = false, UnlockScore = 10000 },
            new Character { Id = 4, Name = "Stealth", Type = "Ship", Description = "Small and nimble", Speed = 5, Size = 15, Color = "#9c27b0", IsUnlocked = false, UnlockScore = 15000 }
        );

        // Seed Items
        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, Name = "Shield", Type = "PowerUp", Description = "Temporary invincibility", Effect = "invincible", Value = 5, Color = "#2196f3", Rarity = 3 },
            new Item { Id = 2, Name = "Speed Boost", Type = "PowerUp", Description = "Increases speed temporarily", Effect = "speed_boost", Value = 2, Color = "#ffeb3b", Rarity = 2 },
            new Item { Id = 3, Name = "Score Multiplier", Type = "PowerUp", Description = "2x score for 10 seconds", Effect = "score_multiplier", Value = 10, Color = "#4caf50", Rarity = 4 },
            new Item { Id = 4, Name = "Slow Time", Type = "PowerUp", Description = "Slows down obstacles", Effect = "slow_time", Value = 5, Color = "#e91e63", Rarity = 5 },
            new Item { Id = 5, Name = "Meteor", Type = "Obstacle", Description = "Standard space debris", Effect = "damage", Value = 1, Color = "#ff1744", Rarity = 1 },
            new Item { Id = 6, Name = "Asteroid", Type = "Obstacle", Description = "Large dangerous rock", Effect = "damage", Value = 1, Color = "#d32f2f", Rarity = 2 }
        );
    }
}
