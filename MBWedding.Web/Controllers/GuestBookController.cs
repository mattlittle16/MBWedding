using Microsoft.AspNetCore.Mvc;
using MBWedding.Web.Models;
using MBWedding.Web.Services;

namespace MBWedding.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GuestBookController : ControllerBase
{
    private readonly GuestBookService _guestBookService;

    public GuestBookController(GuestBookService guestBookService)
    {
        _guestBookService = guestBookService;
    }

    /// <summary>
    /// Returns all guestbook entries (read-only, frozen data)
    /// </summary>
    [HttpGet]
    public ActionResult<List<GuestBookEntry>> Get()
    {
        return _guestBookService.GetAll();
    }
}
