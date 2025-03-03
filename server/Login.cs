using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Diagnostics;
using server;
using System.Collections;

namespace server;

public static class LoginRoutes
{
    public record Credentials(string Email, string Password);

    public static async Task<Results<Ok<string>, BadRequest>> LoginByRole(Credentials credentials, NpgsqlDataSource db, HttpContext ctx)
    {

        var cmd = db.CreateCommand("select name, role, company from users where email = $1 and password=$2");
        cmd.Parameters.AddWithValue(credentials.Email);
        cmd.Parameters.AddWithValue(credentials.Password);

        using var reader = await cmd.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {

            var role = reader.GetFieldValue<UserRole>(1);



            ctx.Session.SetString("name", reader.GetString(0));
            ctx.Session.SetInt32("role", (int)role);
            ctx.Session.SetInt32("company", reader.GetInt32(2));





            string location = "";

            switch (role)
            {
                case UserRole.Admin:
                    {
                        location = "/admin";
                        break;
                    }
                case UserRole.super_admin:
                    {
                        location = "/super-admin";
                        break;
                    }
                case UserRole.Service_agent:
                    {
                        location = "/customer-service";
                        break;
                    }

            }
            return TypedResults.Ok(location);

        }
        else
        {
            return TypedResults.BadRequest();
        }



    }


}

