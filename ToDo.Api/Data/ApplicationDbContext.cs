using MongoFramework;
using ToDo.Api.Models;

namespace ToDo.Api.Data
{
    public class ApplicationDbContext : MongoDbContext
    {
        public ApplicationDbContext(IMongoDbConnection connection) : base(connection)
        {
        }

        public MongoDbSet<Todo> Todos { get; set; }

        protected override void OnConfigureMapping(MappingBuilder mappingBuilder)
        {
            mappingBuilder.Entity<Todo>()
                .ToCollection("Todos");
        }
    }
}
