using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;


public class ProductRoutes()
{




    public record Product(int id, string ProductName, string Description, int Price, string ProductCathegory);

    public static async Task<Results<Ok<List<Product>>, BadRequest<string>>> GetProducts(int company, NpgsqlDataSource db)
    {
        List<Product> products = new();

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



    public record PostProductDTO(string Name, string Description, int Price, string Category, int Company);

    public static async Task<IResult> AddProduct(PostProductDTO product, NpgsqlDataSource db)
    {
        try
        {

            using var cmd = db.CreateCommand(
                "INSERT INTO products (product_name, product_description, price, product_category, company) VALUES ($1, $2, $3, $4, $5) RETURNING id");

            cmd.Parameters.AddWithValue(product.Name);
            cmd.Parameters.AddWithValue(product.Description);
            cmd.Parameters.AddWithValue(product.Price);
            cmd.Parameters.AddWithValue(product.Category);
            cmd.Parameters.AddWithValue(product.Company);

            var result = await cmd.ExecuteScalarAsync();

            if (result != null)
            {
                return TypedResults.Ok("Det funkade! Du la till en product!");
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
