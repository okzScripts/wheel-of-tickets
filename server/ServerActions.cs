using System.Data;
using Npgsql; 

namespace server;

public class ServerActions
{
    Database database = new();
    private NpgsqlDataSource db;

    public ServerActions(WebApplication app)
    {
        db = database.Connection(); 
       
        app.MapPost("api/users/admin", async (HttpContext context) =>
        {
            var requestBody = await context.Request.ReadFromJsonAsync<Move>();
            if (requestBody?.tile is null || requestBody?.player is null || requestBody?.game is null || requestBody?.value is null)
            {
                return Results.BadRequest("tile (index), player (id), game (id), and value are required.");
            }
            bool success = await PlayTile(requestBody.tile, requestBody.player, requestBody.game, requestBody.value);
            return success ? Results.Ok(true) : Results.Ok(false);
        });
    }
    
}