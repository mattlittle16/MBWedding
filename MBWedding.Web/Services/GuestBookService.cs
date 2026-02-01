using System.Text.Json;
using MBWedding.Web.Models;

namespace MBWedding.Web.Services;

public class GuestBookService
{
    private readonly List<GuestBookEntry> _entries;

    public GuestBookService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "guestbook.json");

        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"Guestbook data file not found at: {path}");
        }

        var json = File.ReadAllText(path);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        _entries = JsonSerializer.Deserialize<List<GuestBookEntry>>(json, options)
            ?? new List<GuestBookEntry>();
    }

    /// <summary>
    /// Returns all guestbook entries, sorted by date descending (newest first)
    /// </summary>
    public List<GuestBookEntry> GetAll()
    {
        return _entries
            .OrderByDescending(e => e.Date)
            .ToList();
    }

    /// <summary>
    /// Returns the total number of entries
    /// </summary>
    public int Count => _entries.Count;
}
