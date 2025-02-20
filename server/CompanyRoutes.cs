using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;




public class CompanyRoutes
{


    public record Company(int id, string name, string email, string phone, string description, string domain);
    public record Category(int id, string category_name);
    public record Ticket(int companyId, int productId, int categoryId, string message);
    public record Product(int id, string product_name);
    
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
                    reader.GetInt32(0), 
                    reader.GetString(1), 
                    reader.GetString(2), 
                    reader.GetString(3), 
                    reader.GetString(4), 
                    reader.GetString(5)  
                ));
            }

            
            return TypedResults.Ok(companies);
        }
        catch (Exception ex)
        {
           
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

   
    public static async Task<Results<Ok<List<Category>>, BadRequest<string>>> GetCategories(NpgsqlDataSource db)
    {
        var categories = new List<Category>();

        try
        {
            using var cmd = db.CreateCommand(
                "SELECT id, category_name FROM ticket_categories ORDER BY id ASC"
            );
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                categories.Add(new Category(
                    reader.GetInt32(0),     
                    reader.GetString(1)      
                ));
            }

            return TypedResults.Ok(categories);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }
    
    public static async Task<Results<Ok<List<Product>>, BadRequest<string>>> GetProducts(NpgsqlDataSource db)
    {
        var products = new List<Product>();

        try
        {
            using var cmd = db.CreateCommand(
                "SELECT id, product_name FROM products ORDER BY id ASC"
            );
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                products.Add(new Product(
                    reader.GetInt32(0),   
                    reader.GetString(1)
                ));
            }

            return TypedResults.Ok(products);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }
    
    public static async Task<Results<Ok<int>, BadRequest<string>>> CreateTicket(Ticket ticket, NpgsqlDataSource db)
    {
        try
        {
           
            int status = 1;

            using var cmd = db.CreateCommand(
                @"INSERT INTO tickets (message, status, customer, product_id, ticket_category)
                  VALUES ($1, $2, $3, $4, $5) RETURNING id"
            );
            cmd.Parameters.AddWithValue(ticket.message);
            cmd.Parameters.AddWithValue(status);
            cmd.Parameters.AddWithValue(ticket.companyId); // ska vara customer id efter att vi lagt till login 
            cmd.Parameters.AddWithValue(ticket.productId);
            cmd.Parameters.AddWithValue(ticket.categoryId);

            var newId = await cmd.ExecuteScalarAsync();

            
            return TypedResults.Ok(Convert.ToInt32(newId));
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }


}
