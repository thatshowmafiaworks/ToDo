using Microsoft.AspNetCore.Mvc;

namespace ToDo.Api.Controllers
{
    [Route("todo")]
    public class ToDoController : ControllerBase
    {
        public ToDoController() { }

        [HttpGet]
        public IActionResult GetHi()
        {
            return Ok("Hi!!");
        }
    }
}
