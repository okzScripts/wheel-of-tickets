using System.Data;
using Npgsql; 
using enums;
namespace server;

public class ServerActions
{
    Database database = new();
    private NpgsqlDataSource db;

    public ServerActions(WebApplication app)
    {
        db = database.Connection();

        app.MapPost("api/users/admin", async (HttpContext context) =>
        {
            var user = await context.Request.ReadFromJsonAsync<User>();
            if (user.role == (int)Roles.admin)
            {
            Admins.addAdmin(user.name, user.email, user.password, user.company, db);
                
            }

        });
    }

}

record User(string name, string email, string password, int company, int role);


