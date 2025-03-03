using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
//namespace server;

public class TicketRoutes
{
    public record Ticket(int id, int status, string customer_url, int product_id, int ticket_category);

    public record NewTicket(int companyId, int productId, int categoryId, string message);

    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetUnassignedTickets(int id, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand(@"
    SELECT 
        t.id,
        t.status,
        t.customer_url,
        t.product_id,
        t.ticket_category
    FROM 
        tickets AS t 
    JOIN 
        customer_agentsxticket_category AS catc 
        ON t.ticket_category = catc.ticket_category  
    WHERE 
        t.customer_agent IS NULL AND catc.customer_agent = $1");

            cmd.Parameters.AddWithValue(id);


            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var ticket = new Ticket(
                    reader.GetInt32(0),
                    reader.GetInt32(1),
                    reader.GetString(2),
                    reader.GetInt32(3),
                    reader.GetInt32(4)
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


    public static async Task<Results<Ok<string>, BadRequest<string>>> AssignTicket(int id, int agent, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand("UPDATE tickets SET customer_agent = $2 WHERE id = $1");

            cmd.Parameters.AddWithValue(id);
            cmd.Parameters.AddWithValue(agent);

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



    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetAssignedTickets(int id, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();


        try
        {
            using var cmd = db.CreateCommand(@"
                SELECT  t.id, t.status, t.customer_url,t.product_id, t.ticket_category
                FROM tickets t 
                WHERE t.customer_agent = $1 ");

            cmd.Parameters.AddWithValue(id);


            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                tickets.Add(new Ticket(
                reader.GetInt32(0),
                reader.GetInt32(1),
                reader.GetString(2),
                reader.GetInt32(3),
                reader.GetInt32(4)
                ));
            }

            return TypedResults.Ok(tickets);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<int>, BadRequest<string>>> CreateTicket(NewTicket ticket, NpgsqlDataSource db)
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
            cmd.Parameters.AddWithValue(ticket.companyId);
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



