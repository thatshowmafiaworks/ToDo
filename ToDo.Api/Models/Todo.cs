using MongoDB.Bson;

namespace ToDo.Api.Models
{
    public class Todo
    {
        public ObjectId Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public Status Status { get; set; } = Status.ToDo;
        public bool IsArchived { get; set; } = false;
    }
}
