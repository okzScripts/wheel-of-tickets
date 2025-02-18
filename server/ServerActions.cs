using System.Data;
using System.Net.Mail;
using Npgsql; 

namespace server;

public class ServerActions
{
    Database database = new();
    private NpgsqlDataSource db;

    public ServerActions(WebApplication app)
    {
        db = database.Connection();

        app.MapPost("/api/create-user", async (HttpContext context) =>
        {
            var user = await context.Request.ReadFromJsonAsync<User>();
            if (user == null)
            {
                return Results.BadRequest("Ogiltig inmatning");
            }

            var customer = new Customer(db);
            
            await customer.AddCustomerAsync(user.name, user.email, user.password);

            return Results.Ok("Användare skapad");
        });


    }
    
}

public enum Roles
{
    customer = 1,
    support = 2,
    admin = 3,
    superAdmin = 4
}

record User(string name, string email, string password );