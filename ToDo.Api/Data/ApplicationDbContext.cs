using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace ToDo.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser<ObjectId>, IdentityRole<ObjectId>, ObjectId>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

    }
}
