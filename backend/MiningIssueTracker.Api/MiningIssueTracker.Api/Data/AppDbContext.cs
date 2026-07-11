using Microsoft.EntityFrameworkCore;
using MiningIssueTracker.Api.Models;

namespace MiningIssueTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Site> Sites => Set<Site>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Issue> Issues => Set<Issue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Site>()
            .HasIndex(site => site.Name)
            .IsUnique();

        modelBuilder.Entity<Equipment>()
            .HasOne(equipment => equipment.Site)
            .WithMany(site => site.Equipment)
            .HasForeignKey(equipment => equipment.SiteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Issue>()
            .HasOne(issue => issue.Site)
            .WithMany(site => site.Issues)
            .HasForeignKey(issue => issue.SiteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Issue>()
            .HasOne(issue => issue.Equipment)
            .WithMany(equipment => equipment.Issues)
            .HasForeignKey(issue => issue.EquipmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Issue>()
            .Property(issue => issue.Priority)
            .HasConversion<string>();

        modelBuilder.Entity<Issue>()
            .Property(issue => issue.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Site>().HasData(
            new Site { Id = 1, Name = "Site A", Location = "Welshpool, WA" },
            new Site { Id = 2, Name = "Site B", Location = "Karratha, WA" }
        );

        modelBuilder.Entity<Equipment>().HasData(
            new Equipment { Id = 1, Name = "Crusher #3", Type = "Crusher", SiteId = 1 },
            new Equipment { Id = 2, Name = "Conveyor Belt #1", Type = "Conveyor", SiteId = 1 },
            new Equipment { Id = 3, Name = "Drill Rig #2", Type = "Drill", SiteId = 2 }
        );
    }
}
