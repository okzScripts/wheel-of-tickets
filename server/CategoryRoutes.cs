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

    public record Category(int id, string category_name);

    public static async Task<Results<Ok<List<Category>>, BadRequest<string>>> GetCategoriesByCompany(NpgsqlDataSource db, HttpContext ctx)
    {

        List<Category> categorylist = new();

        if (ctx.Session.IsAvailable || ctx.Session.GetInt32("role") is int roleInt && Enum.IsDefined(typeof(UserRole), roleInt) && (UserRole)roleInt != UserRole.Admin)
        {
            try
            {

                using var cmd = db.CreateCommand("SELECT id, category_name,active FROM ticket_categories WHERE company = $1");

                int? companyId = ctx.Session.GetInt32("company");

                if (!companyId.HasValue)
                {
                    return TypedResults.BadRequest("Session does not exist or you are not an admin");
                }

                cmd.Parameters.AddWithValue(companyId.Value);

                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    categorylist.Add(new Category(reader.GetInt32(0),
                                                  reader.GetString(1)));
                }
                return TypedResults.Ok(categorylist);




            }
            catch (Exception ex)
            {
                return TypedResults.BadRequest(ex.Message);
            }
        }
        return TypedResults.BadRequest("No session available");


    }
}

