using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;


public  class ProductRoutes(){




public record Product(int id, string ProductName, string Description, int Price, string ProductCathegory); 

public static async Task<Results<Ok<List<Product>>, BadRequest<string>>> GetProducts(int company, NpgsqlDataSource db){
     List<Product> products = new ();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM products WHERE company = $1  ORDER BY id ASC");
            cmd.Parameters.AddWithValue(company);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                products.Add(new Product(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetInt32(3), 
                    reader.GetString(4)
                ));
            }

            // Return the list of companies with a 200 OK response
            return TypedResults.Ok(products);
        }
        catch (Exception ex)
        {
            // Return a 400 BadRequest response with the error message
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

}
