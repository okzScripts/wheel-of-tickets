
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class UserRoutes
{


    public record User(int id, string name, string email, string Password, int company, int role, bool active);






    public static async Task<Results<Ok<List<User>>, BadRequest<string>>> GetUsers(int role, NpgsqlDataSource db)
    {
        List<User> users = new List<User>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM users WHERE role = $1  ORDER BY id ASC");
            cmd.Parameters.AddWithValue(role);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                users.Add(new User(
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
            return TypedResults.Ok(users);
        }
        catch (Exception ex)
        {
            // Return a 400 BadRequest response with the error message
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<string>, BadRequest<string>>> BlockUser(string email, bool active, NpgsqlDataSource db)
    {

        try
        {

            using var cmd = db.CreateCommand("UPDATE users SET active = $1 WHERE email = $2");
            cmd.Parameters.AddWithValue(active ? false : true);
            cmd.Parameters.AddWithValue(email);



            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            if (rowsAffected > 0)
            {
                return TypedResults.Ok("Det funkade!");
            }
            else
            {
                return TypedResults.BadRequest("Ajsing bajsing, det funkade ej");
            }

        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"(Detta är Catch) Det funkade inte: {ex.Message}");
        }

    }


    public static async Task<Results<Ok<User>, BadRequest<string>>> GetUser(int role, string email, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM users WHERE email = $1 AND role = $2");
            cmd.Parameters.AddWithValue(email);
            cmd.Parameters.AddWithValue(role);
            using var reader = await cmd.ExecuteReaderAsync();

            // Deklarera admin innan if-satsen
            User? user = null;

            if (await reader.ReadAsync())
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

                return TypedResults.Ok(user);
            }

            return TypedResults.BadRequest("No admin found with the given email.");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public class AdminRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Company { get; set; }
    }


    public record PostUserDTO(int Id, string Name, string Email, string Password, int Company, int Role);


    public static async Task<IResult> AddUser(PostUserDTO user, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand(
                "INSERT INTO users (name, email, password, company, role, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id");

            cmd.Parameters.AddWithValue(user.Name);
            cmd.Parameters.AddWithValue(user.Email);
            cmd.Parameters.AddWithValue(user.Password);
            cmd.Parameters.AddWithValue(user.Company);
            cmd.Parameters.AddWithValue(user.Role); // Role för admin
            cmd.Parameters.AddWithValue(true);

            var result = await cmd.ExecuteScalarAsync();

            if (result != null)
            {
                return TypedResults.Ok("Det funkade! Du la till en admin!");
            }
            else
            {
                return TypedResults.BadRequest("Ajsing bajsing, det funkade ej att lägga till admin");
            }
        }
        catch (PostgresException ex) when (ex.SqlState == "23505") // Hanterar unikhetsfel
        {
            return TypedResults.BadRequest("Email-adressen är redan registrerad!");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }
}
