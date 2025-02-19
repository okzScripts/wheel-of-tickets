using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;




public class CompanyRoutes
{


    public record Company(int id, string name, string email, string phone, string description, string domain, bool active);

    public static async Task<Results<Ok<List<Company>>, BadRequest<string>>> GetCompanies(NpgsqlDataSource db)
    {
        List<Company> companies = new List<Company>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM companies ORDER BY id ASC");
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                companies.Add(new Company(
                    reader.GetInt32(0), // Assuming the first column is the ID
                    reader.GetString(1), // Assuming the second column is a string
                    reader.GetString(2), // Assuming the third column is a string
                    reader.GetString(3), // Assuming the fourth column is a string
                    reader.GetString(4), // Assuming the fifth column is a string
                    reader.GetString(5),  // Assuming the sixth column is a string
                    reader.GetBoolean(6)
                ));
            }

            // Return the list of companies with a 200 OK response
            return TypedResults.Ok(companies);
        }
        catch (Exception ex)
        {
            // Return a 400 BadRequest response with the error message
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<Company>, BadRequest<string>>> GetCompany(string email, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM companies WHERE email = $1");
            cmd.Parameters.AddWithValue(email);
            using var reader = await cmd.ExecuteReaderAsync();

            // Deklarera admin innan if-satsen
            Company? company = null;

            if (await reader.ReadAsync())
            {
                company = new Company(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetString(3),
                    reader.GetString(4),
                    reader.GetString(5),
                    reader.GetBoolean(6)
                );

                return TypedResults.Ok(company);
            }

            return TypedResults.BadRequest("No admin found with the given email.");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public record PostCompanyDTO(string Name, string Email, string Phone, string Description, string Domain);

    public static async Task<IResult> AddCompany(PostCompanyDTO company, NpgsqlDataSource db)
    {
        try
        {

            using var cmd = db.CreateCommand(
                "INSERT INTO companies (name, email, phone, description, domain, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id");

            cmd.Parameters.AddWithValue(company.Name);
            cmd.Parameters.AddWithValue(company.Email);
            cmd.Parameters.AddWithValue(company.Phone);
            cmd.Parameters.AddWithValue(company.Description);
            cmd.Parameters.AddWithValue(company.Domain);
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

    public static async Task<IResult> EditCompany(string previousEmail, PostCompanyDTO company, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand(
                "UPDATE companies SET name = $1, email = $2, phone = $3, description = $4, domain = $5, active = $6 WHERE email = $7");

            cmd.Parameters.AddWithValue(company.Name);
            cmd.Parameters.AddWithValue(company.Email);
            cmd.Parameters.AddWithValue(company.Phone);
            cmd.Parameters.AddWithValue(company.Description);
            cmd.Parameters.AddWithValue(company.Domain);
            cmd.Parameters.AddWithValue(true);
            cmd.Parameters.AddWithValue(previousEmail);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            if (rowsAffected == 0)
            {
                return TypedResults.NotFound("User not found.");
            }

            return TypedResults.Ok("User updated successfully!");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<string>, BadRequest<string>>> BlockCompany(string email, bool active, NpgsqlDataSource db)
    {

        try
        {

            using var cmd = db.CreateCommand("UPDATE companies SET active = $1 WHERE email = $2");
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

}
