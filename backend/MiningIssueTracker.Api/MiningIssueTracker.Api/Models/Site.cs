namespace MiningIssueTracker.Api.Models
{
    public class Site
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public ICollection<Equipment> Equipment { get; set; } = [];
        public ICollection<Issue> Issues { get; set; } = [];
    }
}
