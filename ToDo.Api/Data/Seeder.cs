using Microsoft.AspNetCore.Identity;
using ToDo.Api.Models;

namespace ToDo.Api.Data
{
    public static class Seeder
    {
        public async static Task SeedAdminAndRoles(IServiceProvider services)
        {
            var roleMgr = services.GetRequiredService<RoleManager<AppRole>>();
            var userMgr = services.GetRequiredService<UserManager<AppUser>>();
            string[] roles = { "User", "Admin" };

            foreach (var role in roles)
            {
                if (!await roleMgr.RoleExistsAsync(role))
                {
                    var result = await roleMgr.CreateAsync(new AppRole(role));
                }
            }
            var admin = await userMgr.FindByEmailAsync("admin@gmail.com");
            if (admin is null)
            {
                admin = new AppUser
                {
                    Email = "admin@gmail.com",
                    UserName = "admin"
                };
                var adminResult = await userMgr.CreateAsync(admin, "Admin_123");
                await userMgr.AddToRoleAsync(admin, "Admin");
                await userMgr.AddToRoleAsync(admin, "User");
            }
            if (admin != null)
            {
                if (!await userMgr.IsInRoleAsync(admin, "User")) await userMgr.AddToRoleAsync(admin, "User");
                if (!await userMgr.IsInRoleAsync(admin, "Admin")) await userMgr.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
