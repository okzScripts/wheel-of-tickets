using server;
using Npgsql;
using System.Data.Common;

var builder = WebApplication.CreateBuilder(args);
Database database = new();
NpgsqlDataSource db;
db = database.Connection();




var app = builder.Build();

app.MapGet("/api/users/{email}", GetUserById);
app.MapGet("/api/roles/{number}", GetUserRole);
app.Run();
async Task<User> GetUserById(string email)
{
    User user = null;
    await using var cmd = db.CreateCommand("SELECT * FROM users WHERE email = $1");

    cmd.Parameters.AddWithValue(email);
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

async Task<string?> GetUserRole(int number)
{
    string? result = null;
    await using var cmd = db.CreateCommand("SELECT role FROM roles WHERE id = $1");
    cmd.Parameters.AddWithValue(number);

    await using var reader = await cmd.ExecuteReaderAsync();
    if (await reader.ReadAsync()) // Vi hämtar endast en rad
    {
        result = reader.GetString(0); // Fixat indexfelet
    }

    return result;
}

public record User(int id, string name, string email, string password, int company, int role, bool isactive);
