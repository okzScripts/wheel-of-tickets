using server;
using Npgsql;
using System.Data.Common;

var builder = WebApplication.CreateBuilder(args);
Database database = new();
NpgsqlDataSource db;
db = database.Connection();




var app = builder.Build();

app.MapGet("/api/users/{email}", GetUserById);

async Task<User> GetUserById(string email)
{
    User user = null;
    await using var cmd = db.CreateCommand("SELECT * FROM users WHERE email = $1");

    cmd.Parameters.AddWithValue(email);
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        Console.WriteLine("HEJ!");
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

app.Run();

public record User(int id, string name, string email, string password, int company, int role, bool isactive);
