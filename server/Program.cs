using server;
using Npgsql;


var builder = WebApplication.CreateBuilder(args);
Database database = new();






var app = builder.Build();

app.MapGet("/api/users/{email}", GetUserById);





app.Run();


async Task<User> GetUserById(string mail)
{


}

public record User(int id, string name, string email, string password, int company, int role, bool isactive);

