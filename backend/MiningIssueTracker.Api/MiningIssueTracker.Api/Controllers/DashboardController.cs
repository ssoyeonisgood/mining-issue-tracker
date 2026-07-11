using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiningIssueTracker.Api.Data;
using MiningIssueTracker.Api.Models;

namespace MiningIssueTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryResponse>> GetSummary()
    {
        var openIssues = await _db.Issues.CountAsync(issue => issue.Status == IssueStatus.Open);
        var inProgressIssues = await _db.Issues.CountAsync(issue => issue.Status == IssueStatus.InProgress);
        var highPriorityIssues = await _db.Issues.CountAsync(issue => issue.Priority == IssuePriority.High);

        var resolvedIssues = await _db.Issues
            .Where(issue => issue.ResolvedAt != null)
            .Select(issue => new { issue.CreatedAt, issue.ResolvedAt })
            .ToListAsync();

        var averageResolutionHours = resolvedIssues.Count == 0
            ? 0
            : Math.Round(
                resolvedIssues.Average(issue =>
                    (issue.ResolvedAt!.Value - issue.CreatedAt).TotalHours),
                1);

        return Ok(new DashboardSummaryResponse
        {
            OpenIssues = openIssues,
            InProgressIssues = inProgressIssues,
            HighPriorityIssues = highPriorityIssues,
            AverageResolutionHours = averageResolutionHours
        });
    }
}

public class DashboardSummaryResponse
{
    public int OpenIssues { get; set; }
    public int InProgressIssues { get; set; }
    public int HighPriorityIssues { get; set; }
    public double AverageResolutionHours { get; set; }
}
