using server;
using Npgsql;
using System.Data.Common;

var builder = WebApplication.CreateBuilder(args);
Database database = new();
NpgsqlDataSource db;
db = database.Connection();




var app = builder.Build();

app.MapGet("/api/users/{email}", GetUserById);





app.Run();


async Task<User> GetUserById(string mail)
{
    User user;
    await using var cmd = new NpgsqlCommand("SELECT * FROM users WHERE email = $1", db);

    cmd.Parameters.AddWithValue(mail);
    await using (var reader = await cmd.ExecuteReaderAsync())
    {

        while (await reader.ReadAsync())
        {
            user = new User(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetInt32(4),
            reader.GetInt32(5),
            reader.GetBoolean(6)
            );
        }

    }
    return user;
}

public record User(int id, string name, string email, string password, int company, int role, bool isactive);
