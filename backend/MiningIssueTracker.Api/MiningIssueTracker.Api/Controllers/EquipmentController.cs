using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiningIssueTracker.Api.Data;

namespace MiningIssueTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _db;

    public EquipmentController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EquipmentResponse>>> GetEquipment([FromQuery] int? siteId)
    {
        var query = _db.Equipment.AsQueryable();

        if (siteId.HasValue)
        {
            query = query.Where(equipment => equipment.SiteId == siteId.Value);
        }

        var equipment = await query
            .OrderBy(item => item.Name)
            .Select(item => new EquipmentResponse(item.Id, item.Name, item.Type, item.SiteId))
            .ToListAsync();

        return Ok(equipment);
    }
}

public record EquipmentResponse(int Id, string Name, string? Type, int SiteId);
