using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;
using ToDo.Api.Models;
using ToDo.Api.Models.DTOs;
using ToDo.Api.Services;

namespace ToDo.Api.Controllers
{
    [Route("todo")]
    public class TodoController(
        UserManager<AppUser> _userMgr,
        TodoRepository _repo,
        ILogger<TodoController> _logger
        ) : ControllerBase
    {

        [Authorize]
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    throw new InvalidDataException("Id is invalid.");
                }

                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new InvalidDataException("Email claim is null or empty.");
                }

                var user = await _userMgr.FindByEmailAsync(email);
                if (user == null)
                {
                    throw new NullReferenceException($"User with email: '{email}' is not found");
                }

                var todo = await _repo.Get(id);
                if (todo == null)
                {
                    throw new NullReferenceException($"Todo with id: '{id}' is not found");
                }

                if (todo.UserId == user.Id)
                {
                    return Ok(new TodoViewModel(todo));
                }
                if (await _userMgr.IsInRoleAsync(user, "Admin"))
                {
                    return Ok(new TodoViewModel(todo));
                }
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Getting todo from id went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllForAllUsers()
        {
            try
            {
                var todoList = await _repo.GetAll();
                var response = todoList.Select(x => new TodoViewModel(x)).ToList();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Getting all todos went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }

        [Authorize]
        [HttpGet]
        [Route("my")]
        public async Task<IActionResult> GetAllForCurrentUser()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new InvalidDataException("Email claim is null or empty.");
                }

                var user = await _userMgr.FindByEmailAsync(email);

                if (user == null)
                {
                    throw new NullReferenceException($"User with email: '{email}' if not found");
                }
                var todos = await _repo.GetAllForUser(user);
                var response = todos.Select(x => new TodoViewModel(x)).ToList();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Getting todos for user went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TodoDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new InvalidDataException("ModelState is invalid.");
                }

                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new InvalidDataException("Email claim is null or empty.");
                }

                var user = await _userMgr.FindByEmailAsync(email);

                if (user == null)
                {
                    throw new NullReferenceException($"User with email: '{email}' if not found");
                }
                var todo = new Todo
                {
                    Id = ObjectId.GenerateNewId(),
                    UserId = user.Id,
                    Title = model.Title,
                    Description = model.Description,
                    Status = model.Status,
                    Created = DateTime.UtcNow,
                    Updated = DateTime.UtcNow,
                    IsArchived = false,
                };
                await _repo.Create(todo);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Creating new todo went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TodoDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new InvalidDataException("ModelState is invalid.");
                }
                if (string.IsNullOrEmpty(id))
                {
                    throw new InvalidDataException($"Id is wrong:'{id}'");
                }
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new InvalidDataException("Email claim is null or empty.");
                }

                var user = await _userMgr.FindByEmailAsync(email);

                if (user == null)
                {
                    throw new NullReferenceException($"User with email: '{email}' if not found");
                }
                var todo = await _repo.Get(id);
                if (todo == null)
                {
                    throw new NullReferenceException($"Todo with id: '{id}' is not found");
                }
                if (todo.UserId == user.Id ||
                    await _userMgr.IsInRoleAsync(user, "Admin"))
                {
                    todo.Title = model.Title;
                    todo.Description = model.Description;
                    todo.Status = model.Status;
                    todo.Updated = DateTime.UtcNow;
                    await _repo.Update(todo);
                    return Ok();
                }
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Updating todo went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    throw new InvalidDataException("Id is invalid.");
                }

                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new InvalidDataException("Email claim is null or empty.");
                }

                var user = await _userMgr.FindByEmailAsync(email);
                if (user == null)
                {
                    throw new NullReferenceException($"User with email: '{email}' is not found");
                }

                var todo = await _repo.Get(id);
                if (todo == null)
                {
                    throw new NullReferenceException($"Todo with id: '{id}' is not found");
                }

                if (todo.UserId == user.Id)
                {
                    await _repo.Delete(todo);
                    return Ok();
                }
                if (await _userMgr.IsInRoleAsync(user, "Admin"))
                {
                    await _repo.Delete(todo);
                    return Ok();
                }
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Deleting todo went wrong with exception:{ex.Message}\nWith Inner:{ex.InnerException?.Message}");
                return StatusCode(500, new { Error = "Something went wrong, please try again later." });
            }
        }
    }
}
