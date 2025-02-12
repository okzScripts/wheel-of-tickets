
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class UserRoutes
{


    public record Admin(int id, string name, string email, string Password, int company, int role, bool active);

    public static async Task<Results<Ok<List<Admin>>, BadRequest<string>>> GetAdmins(NpgsqlDataSource db)
    {
        List<Admin> admins = new List<Admin>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM users WHERE role = 3");
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                admins.Add(new Admin(
                    reader.GetInt32(0), // Assuming the first column is the ID
                    reader.GetString(1), // Assuming the second column is a string
                    reader.GetString(2), // Assuming the third column is a string
                    reader.GetString(3), // Assuming the fourth column is a string
                    reader.GetInt32(4),
                    reader.GetInt32(5),
                    reader.GetBoolean(6)
                ));
            }

            // Return the list of companies with a 200 OK response
            return TypedResults.Ok(admins);
        }
        catch (Exception ex)
        {
            // Return a 400 BadRequest response with the error message
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<Admin>, BadRequest<string>>> GetAdmin(string email, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM users WHERE email = $1");
            cmd.Parameters.AddWithValue(email);
            using var reader = await cmd.ExecuteReaderAsync();

            // Deklarera admin innan if-satsen
            Admin? admin = null;

            if (await reader.ReadAsync())
            {
                admin = new Admin(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetString(3),
                    reader.GetInt32(4),
                    reader.GetInt32(5),
                    reader.GetBoolean(6)
                );

                return TypedResults.Ok(admin);
            }

            return TypedResults.BadRequest("No admin found with the given email.");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

}
