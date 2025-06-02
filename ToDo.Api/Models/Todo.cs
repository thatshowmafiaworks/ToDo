using MongoDB.Bson;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDo.Api.Models
{
    [Table("Todos")]
    public class Todo
    {
        public ObjectId Id { get; set; }
        public ObjectId UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public Status Status { get; set; } = Status.ToDo;
        public bool IsArchived { get; set; } = false;
        public AppUser AppUser { get; set; }
    }
}
