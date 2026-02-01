using Microsoft.AspNetCore.Mvc;

namespace MBWedding.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public GalleryController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet]
    public ActionResult<List<string>> Get()
    {
        var galleryPath = Path.Combine(_env.WebRootPath, "app", "assets", "img", "gallery");

        if (!Directory.Exists(galleryPath))
        {
            return NotFound("Gallery directory not found");
        }

        var images = Directory.GetFiles(galleryPath)
            .Where(f => f.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                        f.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                        f.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
            .Select(f => "/app/assets/img/gallery/" + Path.GetFileName(f))
            .OrderBy(f => f)
            .ToList();

        return images;
    }
}
