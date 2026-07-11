using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiningIssueTracker.Api.Data;
using MiningIssueTracker.Api.Models;

namespace MiningIssueTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IssuesController : ControllerBase
{
    private readonly AppDbContext _db;

    public IssuesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Issue>>> GetIssues(
        [FromQuery] IssueStatus? status,
        [FromQuery] IssuePriority? priority,
        [FromQuery] int? siteId)
    {
        var query = _db.Issues
            .Include(issue => issue.Site)
            .Include(issue => issue.Equipment)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(issue => issue.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(issue => issue.Priority == priority.Value);
        }

        if (siteId.HasValue)
        {
            query = query.Where(issue => issue.SiteId == siteId.Value);
        }

        var issues = await query
            .OrderByDescending(issue => issue.CreatedAt)
            .ToListAsync();

        return Ok(issues);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Issue>> GetIssue(int id)
    {
        var issue = await _db.Issues
            .Include(i => i.Site)
            .Include(i => i.Equipment)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (issue is null)
        {
            return NotFound();
        }

        return Ok(issue);
    }

    [HttpPost]
    public async Task<ActionResult<Issue>> CreateIssue([FromBody] CreateIssueRequest request)
    {
        var siteExists = await _db.Sites.AnyAsync(site => site.Id == request.SiteId);
        if (!siteExists)
        {
            return BadRequest($"Site {request.SiteId} does not exist.");
        }

        if (request.EquipmentId.HasValue)
        {
            var equipmentExists = await _db.Equipment.AnyAsync(
                equipment => equipment.Id == request.EquipmentId && equipment.SiteId == request.SiteId);

            if (!equipmentExists)
            {
                return BadRequest($"Equipment {request.EquipmentId} does not exist for Site {request.SiteId}.");
            }
        }

        var issue = new Issue
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Priority = request.Priority,
            Status = IssueStatus.Open,
            SiteId = request.SiteId,
            EquipmentId = request.EquipmentId,
            AssignedTo = request.AssignedTo,
            CreatedAt = DateTime.UtcNow
        };

        _db.Issues.Add(issue);
        await _db.SaveChangesAsync();

        await _db.Entry(issue).Reference(i => i.Site).LoadAsync();
        if (issue.EquipmentId.HasValue)
        {
            await _db.Entry(issue).Reference(i => i.Equipment).LoadAsync();
        }

        return CreatedAtAction(nameof(GetIssue), new { id = issue.Id }, issue);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<Issue>> UpdateStatus(int id, [FromBody] UpdateIssueStatusRequest request)
    {
        var issue = await _db.Issues.FindAsync(id);
        if (issue is null)
        {
            return NotFound();
        }

        issue.Status = request.Status;

        if (request.Status == IssueStatus.Resolved)
        {
            issue.ResolvedAt = DateTime.UtcNow;
        }
        else
        {
            issue.ResolvedAt = null;
        }

        await _db.SaveChangesAsync();

        return Ok(issue);
    }
}

public class CreateIssueRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public IssuePriority Priority { get; set; } = IssuePriority.Medium;
    public int SiteId { get; set; }
    public int? EquipmentId { get; set; }
    public string? AssignedTo { get; set; }
}

public class UpdateIssueStatusRequest
{
    public IssueStatus Status { get; set; }
}
