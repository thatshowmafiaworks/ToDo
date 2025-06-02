using AspNetCore.Identity.Mongo.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDo.Api.Models
{
    [Table("Users")]
    public class AppUser : MongoUser
    {
    }
}
