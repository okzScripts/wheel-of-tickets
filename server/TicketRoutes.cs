using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class TicketRoutes
{
    public record Ticket(int id, string message, int status, int customer, int product_id, int? customer_agent, int ticket_category);
    
    public record NewTicket(int companyId, int productId, int categoryId, string message);

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

    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetAssignedTickets(int customer_agent, NpgsqlDataSource db)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            using var cmd = db.CreateCommand("SELECT * FROM tickets WHERE customer_agent = $1");
            cmd.Parameters.AddWithValue(customer_agent);
            using var reader = await cmd.ExecuteReaderAsync();

            {
                while (await reader.ReadAsync())
                {
                    tickets.Add(new Ticket(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetInt32(2),
                        reader.GetInt32(3),
                        reader.GetInt32(4),
                        reader.IsDBNull(5) ? null : reader.GetInt32(5),
                        reader.GetInt32(6)
                    ));
                }
                return TypedResults.Ok(tickets);
            }

        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade 2: {ex.Message}");
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

