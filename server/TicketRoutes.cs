using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class TicketRoutes
{
    public record Ticket(int id, string message, int status, int customer, int product_id, int? customer_agent, int ticket_category);

    public static async Task<Results<Ok<Ticket>, BadRequest<string>>> GetRandomTicket(NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM tickets ORDER BY RANDOM() LIMIT 1");
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                var ticket = new Ticket(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetInt32(2),
                    reader.GetInt32(3),
                    reader.GetInt32(4),
                    reader.GetInt32(5),
                    reader.GetInt32(6)
                );
                return TypedResults.Ok(ticket);
            }
            else
            {
                return TypedResults.BadRequest("Ingen ticket hittades.");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<string>, BadRequest<string>>> AssignTicket(int customer_agent, int id, NpgsqlDataSource db)
    {

        try
        {
            using var cmd = db.CreateCommand("UPDATE tickets SET customer_agent = $1 WHERE id = $2");

            cmd.Parameters.AddWithValue(customer_agent);
            cmd.Parameters.AddWithValue(id);


            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {

                return TypedResults.Ok("Det funkade");
            }
            else
            {
                return TypedResults.BadRequest("Det funkade inte. Finns nog ingen ticket med den ID eller user för den delen");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Nej det funkade inte att göra så {ex.Message}");
        }
    }


    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetUnassignedTickets(NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM tickets WHERE customer_agent IS NULL ORDER BY ID ASC");
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var ticket = new Ticket(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetInt32(2),
                    reader.GetInt32(3),
                    reader.GetInt32(4),
                    reader.IsDBNull(5) ? null : reader.GetInt32(5),
                    reader.GetInt32(6)
                );
                tickets.Add(ticket);
            }
            return TypedResults.Ok(tickets);

        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }
}

