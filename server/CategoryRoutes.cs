using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
using System.ComponentModel;
namespace server;

public class CategoryRoutes
{

    public static async Task<Results<Ok<List<int>>, BadRequest<string>>> GetCategoriesByUserId(NpgsqlDataSource db, int id)
    {
        List<int> usercategories = new();

        try
        {

            using var cmd = db.CreateCommand("SELECT ticket_category from customer_agentsxticket_category where customer_agent = $1 ");
            cmd.Parameters.AddWithValue(id);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                usercategories.Add(reader.GetInt32(0));
            }
            return TypedResults.Ok(usercategories);

        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest("nej de gick inte");
        }

    }



}