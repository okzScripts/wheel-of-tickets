using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class TicketRoutes
{
    public record Ticket(int id, string message, int status, int customer, int product_id, int? customer_agent, int ticket_category);

    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetTickets(int company, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand(@"
    SELECT t.id, t.message, t.status, t.customer, t.product_id, t.customer_agent, t.ticket_category 
    FROM tickets t
    JOIN products p ON t.product_id = p.id
    JOIN companies c ON p.company = c.id
    WHERE c.id = $1 AND t.customer_agent IS NULL");

            cmd.Parameters.AddWithValue(company); // Correct parameter assignment


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

    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetUnassignedTickets(int company, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand(@"
            SELECT t.id, t.message, t.status, t.customer, t.product_id, t.customer_agent, t.ticket_category
            FROM tickets t
            JOIN products p ON t.product_id = p.id
            WHERE t.customer_agent IS NULL AND p.company = $1
            ORDER BY t.id ASC");

            cmd.Parameters.AddWithValue(company);
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

    public static async Task<Results<Ok<string>, BadRequest<string>>> AssignTicket(int id, int customer_agent, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("UPDATE tickets SET customer_agent = $2 WHERE id = $1");

            cmd.Parameters.AddWithValue(id);
            cmd.Parameters.AddWithValue(customer_agent);

            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
                return TypedResults.Ok("Ticket assigned successfully.");
            }
            else
            {
                return TypedResults.BadRequest("Ticket assignment failed. Ticket ID or customer agent might be invalid.");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error: {ex.Message}");
        }
    }


    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetAssignedTickets(int company, int customer_agent, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand(@"
            SELECT t.id, t.message, t.status, t.customer, t.product_id, t.customer_agent, t.ticket_category
            FROM tickets t
            JOIN products p ON t.product_id = p.id
            WHERE t.customer_agent = $1 AND p.company = $2");

            cmd.Parameters.AddWithValue(customer_agent);
            cmd.Parameters.AddWithValue(company);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                tickets.Add(new Ticket(
                    reader.GetInt32(0), // id
                    reader.GetString(1), // message
                    reader.GetInt32(2), // status
                    reader.GetInt32(3), // customer
                    reader.GetInt32(4), // product_id
                    reader.IsDBNull(5) ? null : reader.GetInt32(5), // customer_agent (nullable)
                    reader.GetInt32(6)  // ticket_category
                ));
            }

            return TypedResults.Ok(tickets);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }
}


