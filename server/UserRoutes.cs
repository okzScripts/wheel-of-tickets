
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;
public enum UserRole
{
    Admin,
    super_admin,
    Service_agent,

}
public record GetUsersDTO(int id, string name, UserRole userrole);
public class UserRoutes
{


    public record User(int id, string name, string email, string Password, int company, bool active, UserRole role);


    public static async Task<Results<Ok<List<User>>, BadRequest<string>>> GetUsers(string role, NpgsqlDataSource db)
    {
        List<User> users = new List<User>();

        try
        {
            Enum.TryParse<UserRole>(role, true, out var userrole);


            using var cmd = db.CreateCommand("SELECT id,name,email,password,company, active, role FROM users WHERE role = $1  ORDER BY id ASC");
            cmd.Parameters.AddWithValue(userrole);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                users.Add(new User(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetString(3),
                    reader.GetInt32(4),
                    reader.GetBoolean(5),
                    reader.GetFieldValue<UserRole>(6)
                ));
            }

            return TypedResults.Ok(users);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    //?????public record GetUserByRoleDTO(UserRole Role)

    public static async Task<Results<Ok<List<User>>, BadRequest<string>>> GetUsersFromCompany(string role, NpgsqlDataSource db, HttpContext ctx)
    {

        List<User> users = new List<User>();

        try
        {
            using var cmd = db.CreateCommand("SELECT id,name,email,password,company,active,role FROM users WHERE role = $1 AND company=$2  ORDER BY id ASC");

            Enum.TryParse<UserRole>(role, true, out var userrole);


            if (ctx.Session.IsAvailable)
            {
                var companyId = ctx.Session.GetInt32("company");
                if (companyId == null)
                {
                    return TypedResults.BadRequest("Session not exisiting");
                }

                cmd.Parameters.AddWithValue(userrole);
                cmd.Parameters.AddWithValue(companyId);

                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    users.Add(new User(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        reader.GetString(3),
                        reader.GetInt32(4),
                        reader.GetBoolean(5),
                        reader.GetFieldValue<UserRole>(6)
                    ));
                }

                return TypedResults.Ok(users);
            }
            else
            {
                return TypedResults.BadRequest("ICKE SA NICKE!");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error {ex.Message}");
        }
    }



    public static async Task<Results<Ok<string>, BadRequest<string>>> BlockUser(int id, bool active, NpgsqlDataSource db)
    {

        try
        {

            using var cmd = db.CreateCommand("UPDATE users SET active = $1 WHERE id = $2");
            cmd.Parameters.AddWithValue(active ? false : true);
            cmd.Parameters.AddWithValue(id);



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


    public static async Task<Results<Ok<User>, BadRequest<string>>> GetUser(int id, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("SELECT id,name,email,password,company,active,role FROM users WHERE id = $1 ");

            cmd.Parameters.AddWithValue(id);

            using var reader = await cmd.ExecuteReaderAsync();

            User? user = null;

            if (await reader.ReadAsync())
            {
                user = new User(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetString(3),
                    reader.GetInt32(4),
                    reader.GetBoolean(5),
                    reader.GetFieldValue<UserRole>(6)
                );

                return TypedResults.Ok(user);
            }

            return TypedResults.BadRequest("Ingen admin hittades");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error {ex.Message}");
        }
    }

    public record PostUserDTO(string Name, string Email, string Password, int? Company, string Role);

    public static async Task<IResult> AddUser(PostUserDTO user, NpgsqlDataSource db, HttpContext ctx)
    {

        try
        {
            int? companyId = -1;
            Enum.TryParse<UserRole>(user.Role, true, out var userRole);
            if (user.Company is null)
            {
                if (ctx.Session.IsAvailable)
                {
                    companyId = ctx.Session.GetInt32("company");
                    if (companyId == null)
                    {
                        return TypedResults.BadRequest("Session not exisiting");
                    }
                }
            }
            else { companyId = user.Company; }


            using var cmd = db.CreateCommand(
                "INSERT INTO users (name, email, password, company, role, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id");

            cmd.Parameters.AddWithValue(user.Name);
            cmd.Parameters.AddWithValue(user.Email);
            cmd.Parameters.AddWithValue(user.Password);
            cmd.Parameters.AddWithValue(companyId.HasValue ? companyId : DBNull.Value);
            cmd.Parameters.AddWithValue(userRole);
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
        catch (PostgresException ex) when (ex.SqlState == "23505")
        {
            return TypedResults.BadRequest("Email-adressen är redan registrerad!");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }


    public record PutUserDTO(string Name, string Email, string Password);
    public static async Task<IResult> EditUser(int id, PutUserDTO user, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand(
                "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4");

            cmd.Parameters.AddWithValue(user.Name);
            cmd.Parameters.AddWithValue(user.Email);
            cmd.Parameters.AddWithValue(user.Password);
            cmd.Parameters.AddWithValue(id);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            if (rowsAffected == 0)
            {
                return TypedResults.NotFound("Ingen User hittades");
            }

            return TypedResults.Ok("User updaterades");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error {ex.Message}");
        }
    }

}



/* public static async Task<Results<Ok<List<UserRole>>, UnauthorizedHttpResult, ForbidHttpResult>> GetUserByRole(NpgsqlDataSource db, HttpContext ctx){

     if(ctx.Session.IsAvailable &&
     ctx.Session.GetInt32("role") is int role &&
     Enum.IsDefined(typeof(UserRole), role)){

         if((UserRole)role == UserRole.)
     }


 }






}*/