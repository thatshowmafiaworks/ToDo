namespace ToDo.Api.Models.DTOs
{
    public class TodoViewModel
    {
        public TodoViewModel(Todo todo)
        {
            this.Id = todo.Id.ToString();
            this.UserId = todo.UserId.ToString();
            this.Title = todo.Title;
            this.Description = todo.Description;
            this.Status = todo.Status;
            this.Created = todo.Created;
            this.Updated = todo.Updated;
            this.IsArchived = todo.IsArchived;
        }

        public string Id { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Status Status { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public bool IsArchived { get; set; }
    }
}
