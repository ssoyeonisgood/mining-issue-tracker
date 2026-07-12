using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiningIssueTracker.Api.Data;

namespace MiningIssueTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SitesController : ControllerBase
{
    private readonly AppDbContext _db;

    public SitesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteResponse>>> GetSites()
    {
        var sites = await _db.Sites
            .OrderBy(site => site.Name)
            .Select(site => new SiteResponse(site.Id, site.Name, site.Location))
            .ToListAsync();

        return Ok(sites);
    }
}

public record SiteResponse(int Id, string Name, string? Location);
