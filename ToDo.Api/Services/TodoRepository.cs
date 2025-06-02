using MongoDB.Bson;
using MongoFramework.Linq;
using ToDo.Api.Data;
using ToDo.Api.Models;

namespace ToDo.Api.Services
{
    public class TodoRepository(
        ApplicationDbContext db
        )
    {
        public async Task<List<Todo>> GetAll() => await db.Todos.ToListAsync();
        public async Task<Todo> Get(ObjectId id) => await db.Todos.FindAsync(id);
        public async Task Create(Todo todo)
        {
            db.Todos.Add(todo);
            await db.SaveChangesAsync();
        }
        public async Task Update(Todo todo)
        {
            db.Todos.Update(todo);
            await db.SaveChangesAsync();
        }
        public async Task Delete(Todo todo)
        {
            db.Todos.Remove(todo);
            await db.SaveChangesAsync();
        }
    }
}
