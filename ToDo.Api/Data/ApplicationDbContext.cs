using MongoDB.Driver;
using ToDo.Api.Models;

namespace ToDo.Api.Data
{
    public class ApplicationDbContext
    {
        private readonly IMongoDatabase _db;
        public ApplicationDbContext(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDbConnectionString"]);
            _db = client.GetDatabase(config["MongoDbName"]);
        }

        public IMongoCollection<Todo> Todos => _db.GetCollection<Todo>("Todos");
    }
}
