namespace MiningIssueTracker.Api.Models
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Type { get; set; }
        public int SiteId { get; set; }
        public Site Site { get; set; } = null!;
        public ICollection<Issue> Issues { get; set; } = [];
    }
}
