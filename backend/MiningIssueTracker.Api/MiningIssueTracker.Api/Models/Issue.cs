namespace MiningIssueTracker.Api.Models
{
    public class Issue
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public IssuePriority Priority { get; set; } = IssuePriority.Medium;
        public IssueStatus Status { get; set; } = IssueStatus.Open;
        public int SiteId { get; set; }
        public int? EquipmentId { get; set; }
        public string? AssignedTo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }
        public Site Site { get; set; } = null!;
        public Equipment? Equipment { get; set; }
    }
}
