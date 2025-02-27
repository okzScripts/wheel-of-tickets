using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Diagnostics;
using server;

namespace server;

public static class LoginRoutes
{
    public record Credentials(string Email, string Password);

    public static async Task<Results<Ok<string>, BadRequest>> LoginByRole(Credentials credentials, NpgsqlDataSource db, HttpContext ctx)
    {

        var cmd = db.CreateCommand("select name, role from users where email = $1 and password=$2");
        cmd.Parameters.AddWithValue(credentials.Email);
        cmd.Parameters.AddWithValue(credentials.Password);

        using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {

            var role = reader.GetFieldValue<UserRole>(1);
            ctx.Session.SetString("name", reader.GetString(0));
            ctx.Session.SetInt32("role", (int)role);

            return TypedResults.Ok($"{role}");
        }
        else
        {
            return TypedResults.BadRequest();
        }



    }


}

