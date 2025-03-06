
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
using System.ComponentModel;
using Org.BouncyCastle.Asn1;
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

    public record PostAgentDTO(string Name, string Email, string Password, List<int> SelectedCategories, int? Company, string Role);

    public static async Task<IResult> AddAgent(PostAgentDTO agent, NpgsqlDataSource db, HttpContext ctx)
    {
        await using var conn = await db.OpenConnectionAsync();
        await using var transaction = await conn.BeginTransactionAsync();

        //var categoryList = agent.SelectedCategories?.Select(Convert.ToInt32).ToList() ?? new List<int>();

        List<int> categorylist = agent.SelectedCategories;

        try
        {
            int? companyId = -1;
            Enum.TryParse<UserRole>(agent.Role, true, out var userRole);
            if (agent.Company is null)
            {
                if (ctx.Session.IsAvailable)
                {
                    companyId = ctx.Session.GetInt32("company");
                    if (companyId == null)
                    {
                        return TypedResults.BadRequest("Session not existing");
                    }
                }
            }
            else { companyId = agent.Company; }

            // Första insert: användare
            using var cmd = db.CreateCommand(
                "INSERT INTO users (name, email, password, company, role, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id");

            cmd.Parameters.AddWithValue(agent.Name);
            cmd.Parameters.AddWithValue(agent.Email);
            cmd.Parameters.AddWithValue(agent.Password);
            cmd.Parameters.AddWithValue(companyId.HasValue ? companyId : DBNull.Value);
            cmd.Parameters.AddWithValue(userRole);
            cmd.Parameters.AddWithValue(true);

            var result = await cmd.ExecuteScalarAsync();
            Console.WriteLine(result);
            if (result != null)
            {
                var id = Convert.ToInt32(result);
                Console.WriteLine("ID: " + id);

                foreach (int category in categorylist)
                {
                    Console.WriteLine(category);
                    using var cmd2 = db.CreateCommand(
                        "INSERT INTO customer_agentsxticket_category (ticket_category, customer_agent) VALUES ($1, $2);");

                    // Använd rätt kommandon och parametrar för cmd2
                    cmd2.Parameters.AddWithValue(category);
                    cmd2.Parameters.AddWithValue(id);

                    int rowsaffected = await cmd2.ExecuteNonQueryAsync();

                    Console.WriteLine(rowsaffected);
                }

                return TypedResults.Ok("category done");
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

    public record PutAgentDTO(string Name, string Email, string Password, List<int> Categories);
    public static async Task<IResult> EditAgent(int id, PutAgentDTO agent, NpgsqlDataSource db)
    {
        List<int> categories = agent.Categories;
        try
        {
            using var cmd = db.CreateCommand(
                "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id");

            cmd.Parameters.AddWithValue(agent.Name);
            cmd.Parameters.AddWithValue(agent.Email);
            cmd.Parameters.AddWithValue(agent.Password);
            cmd.Parameters.AddWithValue(id);

            var result = await cmd.ExecuteScalarAsync();

            if (result != null)
            {
                var agentid = Convert.ToInt32(result);
                Console.WriteLine("ID: " + id);

                //HÄR MÅSTE VI TROLIGTVIS TA BORT ALLA KOPPLINGAR HAN HAR I CATEGORYXAGENTS OCH SEDAN LÄGGA TILL DOM NYA

                foreach (int category in categories)
                {
                    Console.WriteLine(category);
                    using var cmd2 = db.CreateCommand(
                        "INSERT INTO customer_agentsxticket_category (ticket_category, customer_agent) VALUES ($1, $2);");

                    // Använd rätt kommandon och parametrar för cmd2
                    cmd2.Parameters.AddWithValue(category);
                    cmd2.Parameters.AddWithValue(id);

                    int rowsaffected = await cmd2.ExecuteNonQueryAsync();

                    Console.WriteLine(rowsaffected);
                }

                return TypedResults.Ok("category done");
            }
            else
            {
                return TypedResults.BadRequest("Ajsing bajsing, det funkade ej att lägga till admin");
            }
            return TypedResults.Ok("User updaterades");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error {ex.Message}");
        }
    }





    public record PasswordDTO(string OldPassword, string Password, string RepeatPassword);
    public static async Task<Results<Ok<string>, BadRequest<string>>> ChangePassword(PasswordDTO passwords, NpgsqlDataSource db, HttpContext ctx)
    {
        if (ctx.Session.IsAvailable)
        {
            var Id = ctx.Session.GetInt32("id");
            if (Id == null)
            {
                return TypedResults.BadRequest("Session not exisiting");
            }
            else
            {
                using var cmd = db.CreateCommand(
               "select password from  users WHERE id = $1");
                cmd.Parameters.AddWithValue(Id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var oldPassword = reader.GetString(0);


                    if (oldPassword != passwords.OldPassword)
                    {
                        return TypedResults.BadRequest("password does not match old password");
                    }
                    else
                    {
                        if (passwords.Password == passwords.RepeatPassword)
                        {
                            using var cmdPut = db.CreateCommand("Update users set password=$1 where id=$2 ");
                            cmdPut.Parameters.AddWithValue(passwords.Password);
                            cmdPut.Parameters.AddWithValue(Id);

                            var rows = await cmdPut.ExecuteNonQueryAsync();
                            if (rows > 0)
                            {
                                return TypedResults.Ok("Password changed");
                            }
                            else
                            {
                                return TypedResults.BadRequest("No rows affected by password change");
                            }

                        }
                        else
                        {
                            return TypedResults.BadRequest("new passwords do not match");
                        }

                    }
                }
                else { return TypedResults.BadRequest("No data found"); }

            }
        }
        else
        {
            return TypedResults.BadRequest("Session does not exist");
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