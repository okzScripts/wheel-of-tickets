using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;


public class ProductRoutes()
{




    public record Product(int id, string Name, string Description, int Price, string Category, int Company);

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
                    reader.GetString(4),
                    reader.GetInt32(5)
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




 public static async Task<Results<Ok<Product>, BadRequest<string>>> GetProduct(int ProductId,NpgsqlDataSource db)
 {
     try
        {
            using var cmd = db.CreateCommand("SELECT * FROM products WHERE id=$1");
            cmd.Parameters.AddWithValue(ProductId);
           
            using var reader = await cmd.ExecuteReaderAsync();

            // Deklarera admin innan if-satsen
            Product? product = null;

            if (await reader.ReadAsync())
            {
                product = new Product(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.GetInt32(3),
                    reader.GetString(4),
                    reader.GetInt32(5)
                );

                return TypedResults.Ok(product);
            }

            return TypedResults.BadRequest("No product found with the given product name.");
        }
        catch (Exception ex)
        {
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
                return TypedResults.BadRequest("Ajsing bajsing, det funkade ej att lägga till produkten");
            }
        }
        catch (PostgresException ex) when (ex.SqlState == "23505") // Hanterar unikhetsfel
        {
            return TypedResults.BadRequest("produkten är redan registrerad!");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }



public record PutProductDTO(string Name, string Description, int Price, string Category, int Company,int id);
 public static async Task<IResult> EditProduct(PutProductDTO product, NpgsqlDataSource db)
{
        try
        {
            using var cmd = db.CreateCommand(
                "UPDATE products SET product_name=$1, product_description=$2, price=$3, product_category=$4 WHERE company=$5 AND id=$6");

                
             cmd.Parameters.AddWithValue(product.Name);
            cmd.Parameters.AddWithValue(product.Description);
            cmd.Parameters.AddWithValue(product.Price);
            cmd.Parameters.AddWithValue(product.Category);
            cmd.Parameters.AddWithValue(product.Company);
            cmd.Parameters.AddWithValue(product.id); 
            int rowsAffected = await cmd.ExecuteNonQueryAsync();

            if (rowsAffected == 0)
            {
                return TypedResults.NotFound("Product not found.");
            }

            return TypedResults.Ok("User updated successfully!");
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

}
