using MBWedding.Web.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddSingleton<GuestBookService>();

// Configure Kestrel for container deployment
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080);
});

var app = builder.Build();

// Serve static files (AngularJS app)
app.UseDefaultFiles();
app.UseStaticFiles();

// Map API controllers
app.MapControllers();

// SPA fallback - serve index.html for unmatched routes
app.MapFallbackToFile("index.html");

app.Run();
