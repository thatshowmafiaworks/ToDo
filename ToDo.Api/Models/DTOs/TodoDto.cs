using System.ComponentModel.DataAnnotations;

namespace ToDo.Api.Models.DTOs
{
    public class TodoDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public Status Status { get; set; }
    }
}
