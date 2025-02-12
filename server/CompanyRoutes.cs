using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;




public class CompanyRoutes
{


    public record Company(int id, string name, string email, string phone, string description, string domain);


    public static async Task<Results<Ok<List<Company>>, BadRequest<string>>> GetCompanies(NpgsqlDataSource db)
    {
        List<Company> companies = new List<Company>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM companies");
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                companies.Add(new Company(
                    reader.GetInt32(0), // Assuming the first column is the ID
                    reader.GetString(1), // Assuming the second column is a string
                    reader.GetString(2), // Assuming the third column is a string
                    reader.GetString(3), // Assuming the fourth column is a string
                    reader.GetString(4), // Assuming the fifth column is a string
                    reader.GetString(5)  // Assuming the sixth column is a string
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

}
