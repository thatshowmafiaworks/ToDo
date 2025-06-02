using AspNetCore.Identity.Mongo.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDo.Api.Models
{
    [Table("Roles")]
    public class AppRole : MongoRole
    {
        public AppRole(string name) : base(name) { }
        public AppRole() : base() { }
    }
}
