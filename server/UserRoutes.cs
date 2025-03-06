
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.Runtime.InteropServices;
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

    public record PostUserDTO(string Name, string Email, int Company, string Role);

    public static async Task<IResult> AddUser(PostUserDTO user, NpgsqlDataSource db, HttpContext ctx)
    {
        if(ctx.Session.IsAvailable || (UserRole)ctx.Session.GetInt32("role") != UserRole.Service_agent  ){
            try
            {   string password;
                int? companyId; 
                Enum.TryParse<UserRole>(user.Role, true, out var userRole);           
                companyId = ctx.Session.GetInt32("company");
                if((UserRole)ctx.Session.GetInt32("role") == UserRole.super_admin ){
                    companyId=user.Company; 
                }
                if (companyId == null){  
                        return TypedResults.BadRequest("Session error variable not existing");
                }



                 
                
                password= GeneratePassword(8);  
                
                using var cmd = db.CreateCommand(
                    "INSERT INTO users (name, email, password, company, role, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id");

                cmd.Parameters.AddWithValue(user.Name);
                cmd.Parameters.AddWithValue(user.Email);
                cmd.Parameters.AddWithValue(password);
                cmd.Parameters.AddWithValue(companyId);
                cmd.Parameters.AddWithValue(userRole);
                cmd.Parameters.AddWithValue(true);

                var result = await cmd.ExecuteScalarAsync();

                if (result != null)
                {
                    string subject = "Account created";
                    string message = "Hi "+user.Name +"\nyour account has now been created for " +user.Email +
                    "\nwith the temporary password: "+password +"\nBest regards Swine Sync";
                    MailService.SendMail(user.Email, subject, message);
                    
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
        else{
            return TypedResults.BadRequest("Session does not exist");         
        }
    }


    public record PutUserDTO(string Name, string Email);
    public static async Task<IResult> EditUser(int id, PutUserDTO user, NpgsqlDataSource db ,HttpContext ctx)
    {    
        

        if(ctx.Session.IsAvailable)
        {
            var role = (UserRole)  ctx.Session.GetInt32("role");
            if (role== UserRole.Service_agent)
            {
                return TypedResults.BadRequest("No access for you");
            }
        try
        {
            using var cmd = db.CreateCommand(
                "UPDATE users SET name = $1, email = $2 WHERE id = $3");

            cmd.Parameters.AddWithValue(user.Name);
            cmd.Parameters.AddWithValue(user.Email);
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
        }else{
            return TypedResults.BadRequest("Session not availabel"); 
        }
     
    }



    public record PasswordDTO( string OldPassword, string Password, string RepeatPassword );
    public static async Task<Results<Ok<string>, BadRequest<string>>> ChangePassword(PasswordDTO passwords,NpgsqlDataSource db, HttpContext ctx)
    {
        if (ctx.Session.IsAvailable)
            {
                var Id = ctx.Session.GetInt32("id");
                if (Id == null)
                {
                    return TypedResults.BadRequest("Session not exisiting");
                }else{
                      using var cmd = db.CreateCommand(
                     "select password from  users WHERE id = $1");
                     cmd.Parameters.AddWithValue(Id);

                     using var reader = await  cmd.ExecuteReaderAsync(); 
                      
                     if(await reader.ReadAsync() ){
                        var oldPassword= reader.GetString(0); 


                        if(oldPassword!=passwords.OldPassword){
                            return TypedResults.BadRequest("password does not match old password");
                        }else{
                            if(passwords.Password==passwords.RepeatPassword){
                            using var cmdPut =  db.CreateCommand("Update users set password=$1 where id=$2 ");
                            cmdPut.Parameters.AddWithValue(passwords.Password); 
                            cmdPut.Parameters.AddWithValue(Id); 

                             var rows= await cmdPut.ExecuteNonQueryAsync(); 
                            if(rows>0){
                                return TypedResults.Ok("Password changed"); 
                            }else{
                                return TypedResults.BadRequest("No rows affected by password change"); 
                            }

                            }else{
                                return TypedResults.BadRequest("new passwords do not match"); 
                            }
                        
                        }
                     }else{return TypedResults.BadRequest("No data found");}

                }
            }else{
                return TypedResults.BadRequest("Session does not exist"); 
            }
    }

public static string GeneratePassword(int length){
        const string capitalLetters = "QWERTYUIOPASDFGHJKLZXCVBNM";
        const string smallLetters = "qwertyuiopasdfghjklzxcvbnm";
        const string digits = "0123456789";
        const string specialCharacters = "!@#$%^&*()-_=+<,>.";
        const string allChars = capitalLetters + smallLetters + digits + specialCharacters;
        StringBuilder password = new StringBuilder();
        Random rnd = new Random();
        while (0 < length--)
        {
            password.Append(allChars[rnd.Next(allChars.Length)]);
        }
        return password.ToString(); 
    }




    public static async Task<Results<Ok<string>, BadRequest<string>>> ResetPassword(int id, NpgsqlDataSource db, HttpContext ctx)
    {
        if (ctx.Session.IsAvailable)
        {

            var role = (UserRole)ctx.Session.GetInt32("role");

            string password = GeneratePassword(8);
            string email = "";

            if (role == UserRole.Service_agent)
            {
                return TypedResults.BadRequest("Unauthorized access");
            }
            else
            {
                await using var conn = await db.OpenConnectionAsync();
                await using var transaction = await conn.BeginTransactionAsync();


                var sql1 = "SELECT email FROM users WHERE id = $1";
                using (var cmd1 = new NpgsqlCommand(sql1, conn, transaction))
                {
                    cmd1.Parameters.AddWithValue(id);

                    using var reader = await cmd1.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        email = reader.GetString(0);
                    }


                }

                var sql2 = "UPDATE users SET password = $1 WHERE id =$2";
                using (var cmd2 = new NpgsqlCommand(sql2, conn, transaction))
                {

                    cmd2.Parameters.AddWithValue(password);
                    cmd2.Parameters.AddWithValue(id);

                    var rows = await cmd2.ExecuteNonQueryAsync();


                    await transaction.CommitAsync();

                    if (rows > 0)
                    {
                        string subject = "Password reset successfully";
                        string message = "Hi \nyour new temporary password is: " + password;
                        MailService.SendMail(email, subject, message);
                        return TypedResults.Ok("password successfully changed");
                    }
                    else
                    {
                        return TypedResults.BadRequest("password not changed");
                    }

                }





            }




        }
        else
        {
            return TypedResults.BadRequest("Session not available");
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