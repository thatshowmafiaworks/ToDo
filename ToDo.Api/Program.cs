using AspNetCore.Identity.Mongo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using Serilog;
using System.Text;
using ToDo.Api.Data;
using ToDo.Api.Models;
using ToDo.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(
    new LoggerConfiguration()
        .MinimumLevel.Information()
        .WriteTo.Console()
        .Enrich.FromLogContext()
        .WriteTo.File("Log/log-.txt", rollingInterval: RollingInterval.Day)
        .CreateLogger()
);

builder.Services.AddScoped<ApplicationDbContext>();

// Adding Identity with MongoDb
builder.Services.AddIdentityMongoDbProvider<AppUser, AppRole, ObjectId>(identity =>
{
    identity.Password.RequireDigit = false;
    identity.Password.RequireLowercase = false;
    identity.Password.RequireNonAlphanumeric = false;
    identity.Password.RequireUppercase = false;
    identity.Password.RequiredLength = 1;
    identity.Password.RequiredUniqueChars = 0;
},
mongo =>
{
    mongo.ConnectionString = builder.Configuration["MongoDbConnectionString"] ?? "";
});

builder.Services.AddAuthentication(opts =>
        {
            opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
    .AddJwtBearer(opts =>
        {
            opts.TokenValidationParameters = new()
            {
                ValidAudience = builder.Configuration["JWT:Audience"],
                ValidIssuer = builder.Configuration["JWT:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigninKey"] ?? "")),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true
            };
        });
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddScoped<TodoRepository>();
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    await Seeder.SeedAdminAndRoles(scope.ServiceProvider);
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
