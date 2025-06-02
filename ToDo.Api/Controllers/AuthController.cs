using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToDo.Api.Models;
using ToDo.Api.Models.DTOs;
using ToDo.Api.Services;

namespace ToDo.Api.Controllers;

[Route("auth")]
public class AuthController(
    ILogger<AuthController> logger,
    UserManager<AppUser> userMgr,
    SignInManager<AppUser> signInMgr,
    JwtTokenGenerator tokenGenerator
    ) : ControllerBase
{
    [Route("register")]
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] UserCredentials creds)
    {
        if (creds == null)
        {
            logger.LogWarning($"Null credentials was sent");
            return StatusCode(500, new { Error = "Something wrong, please try again" });
        }
        if (string.IsNullOrWhiteSpace(creds.Email))
        {
            logger.LogWarning($"User sent empty email");
            return BadRequest(new { Error = "Empty email" });
        }
        if (string.IsNullOrWhiteSpace(creds.Password))
        {
            logger.LogWarning($"User with email:'{creds.Email}' sent empty password");
            return BadRequest(new { Error = "Empty password" });
        }
        var user = await userMgr.FindByEmailAsync(creds.Email);
        if (user != null)
        {
            logger.LogWarning($"User tried to register existing email:'{creds.Email}'");
            return BadRequest(new { Error = "This Email is already registered" });
        }
        try
        {
            var newUser = new AppUser()
            {
                UserName = creds.Email,
                Email = creds.Email
            };
            await userMgr.CreateAsync(newUser, creds.Password);
            await userMgr.AddToRoleAsync(newUser, "User");
            logger.LogInformation($"Created new user with email:'{newUser.Email}'");
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError($"Register went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
            return StatusCode(500, new { Error = "Something wrong, please try again" });
        }
    }

    [Route("login")]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] UserCredentials creds)
    {
        if (creds == null)
        {
            logger.LogWarning($"Null credentials was sent");
            return Unauthorized(new { Error = "Something wrong, please try again" });
        }
        if (string.IsNullOrWhiteSpace(creds.Email))
        {
            logger.LogWarning($"User sent empty email");
            return Unauthorized(new { Error = "Something wrong, please try again" });
        }
        if (string.IsNullOrWhiteSpace(creds.Password))
        {
            logger.LogWarning($"User with email:'{creds.Email}' sent empty password");
            return Unauthorized(new { Error = "Something wrong, please try again" });
        }
        var user = await userMgr.FindByEmailAsync(creds.Email);
        if (user == null)
        {
            logger.LogWarning($"Registered user with email:'{creds.Email}' was not found");
            return Unauthorized(new { Error = "Wrong email, please recheck" });
        }
        var result = await signInMgr.CheckPasswordSignInAsync(user, creds.Password, false);
        if (!result.Succeeded)
        {
            logger.LogWarning($"User tried to signin with email:'{creds.Email}' with wrong password");
            return Unauthorized(new { Error = "Wrong password or email, try again please" });
        }
        try
        {
            var roles = await userMgr.GetRolesAsync(user);

            var token = tokenGenerator.GenerateToken(user, roles);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            logger.LogError($"Signing in went wrong with exception '{nameof(ex)}':{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
            return StatusCode(500, new { Error = "Something wrong, please try again" });
        }
    }
}
