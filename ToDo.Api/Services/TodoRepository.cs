using MongoDB.Driver;
using ToDo.Api.Data;
using ToDo.Api.Models;

namespace ToDo.Api.Services
{
    public class TodoRepository(
        ApplicationDbContext db
        )
    {
        public async Task<List<Todo>> GetAll() => await db.Todos.Find(x => x.UserId == x.UserId).ToListAsync();
        public async Task<List<Todo>> GetAllForUser(AppUser user) => await db.Todos.Find(x => x.UserId == user.Id).ToListAsync();
        public async Task<Todo> Get(string id) => await db.Todos.Find(x => x.Id.ToString().Equals(id)).FirstAsync();
        public async Task Create(Todo todo)
        {
            await db.Todos.InsertOneAsync(todo);

        }
        public async Task Update(Todo todo)
        {
            await db.Todos.ReplaceOneAsync(x => x.Id == todo.Id, todo);
        }
        public async Task Delete(Todo todo)
        {
            await db.Todos.DeleteOneAsync(x => x.Id == todo.Id);
        }
    }
}
