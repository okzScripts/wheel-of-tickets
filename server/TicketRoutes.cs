using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data.Common;
namespace server;

public class TicketRoutes
{
    public record Ticket(int id, int status, string customer_url, int product_id, int ticket_category);

    public record NewTicket(int productId, int categoryId, string message, string email);


    public static async Task<Results<Ok<Ticket>, BadRequest<string>>> GetTicket(int id, NpgsqlDataSource db)
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
    WHERE 
        id = $1");
        cmd.Parameters.AddWithValue(id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            var ticket = new Ticket(
                        reader.GetInt32(0),
                        reader.GetInt32(1),
                        reader.GetString(2),
                        reader.GetInt32(3),
                        reader.GetInt32(4)
                    );
            return TypedResults.Ok(ticket);
        }
        else return TypedResults.BadRequest("Hittade ingen ticket");
    }

    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetUnassignedTickets(NpgsqlDataSource db, HttpContext ctx)
    {
        List<Ticket> tickets = new List<Ticket>();

        try
        {
            if (ctx.Session.IsAvailable)
            {
                var id = ctx.Session.GetInt32("id");
                if (id == null)
                {
                    return TypedResults.BadRequest("Session not exisiting");
                }
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
            else
            {
                return TypedResults.BadRequest($"Missing session");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }


    public static async Task<Results<Ok<string>, BadRequest<string>>> AssignTicket(int id, NpgsqlDataSource db, HttpContext ctx)
    {
        try
        {
            if (ctx.Session.IsAvailable)
            {
                var agent = ctx.Session.GetInt32("id");
                if (agent == null)
                {
                    return TypedResults.BadRequest("Session not exisiting");
                }
                using var cmd = db.CreateCommand("UPDATE tickets SET customer_agent = $2, status = 2 WHERE id = $1");

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
            else
            {
                return TypedResults.BadRequest($"Missing Session");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Error: {ex.Message}");
        }
    }



    public static async Task<Results<Ok<List<Ticket>>, BadRequest<string>>> GetAssignedTickets(NpgsqlDataSource db, HttpContext ctx)
    {
        List<Ticket> tickets = new List<Ticket>();


        try
        {
            if (ctx.Session.IsAvailable)
            {
                var id = ctx.Session.GetInt32("id");
                if (id == null)
                {
                    return TypedResults.BadRequest("Session not exisiting");
                }
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
            else
            {
                return TypedResults.BadRequest($"Missing session");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }

    public static async Task<Results<Ok<string>, BadRequest<string>>> CreateTicket(NewTicket ticket, NpgsqlDataSource db)
    {
        try
        {

            await using var conn = await db.OpenConnectionAsync();
            await using var transaction = await conn.BeginTransactionAsync();

            int status = 1;
            int ticketId;


            var sql1 = "INSERT INTO tickets (status, customer_url, product_id, ticket_category) VALUES ($1, $2, $3, $4) RETURNING id";
            using (var cmd1 = new NpgsqlCommand(sql1, conn, transaction))
            {
                cmd1.Parameters.AddWithValue(status);
                cmd1.Parameters.AddWithValue(ticket.email);
                cmd1.Parameters.AddWithValue(ticket.productId);
                cmd1.Parameters.AddWithValue(ticket.categoryId);

                ticketId = (int)await cmd1.ExecuteScalarAsync();
            }

            var sql2 = "INSERT INTO messages(text, ticket, time, customer) VALUES ($1, $2, $3, $4)";

            using (var cmd2 = new NpgsqlCommand(sql2, conn, transaction))
            {
                cmd2.Parameters.AddWithValue(ticket.message);
                cmd2.Parameters.AddWithValue(ticketId);
                cmd2.Parameters.AddWithValue(DateTime.Now);
                cmd2.Parameters.AddWithValue(true);

                await cmd2.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();

            string url = "http://localhost:5173/customer/" + ticketId + "/chat";
            string subject = "Ticket on Produkt" + ticket.productId;
            string message = "Hej, Vi kommer svara på din ticket så fort vi kan! Här är en länk till chatten. " + url;
            MailService.SendMail(ticket.email, subject, message);
            return TypedResults.Ok(url);


        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }


    public record statusDTO(int status);
    public static async Task<Results<Ok<string>, BadRequest<string>>> ChangeStatus(int id, statusDTO status, NpgsqlDataSource db)
    {
        try
        {
            using var cmd = db.CreateCommand(
                @"UPDATE tickets SET status = $1 WHERE id = $2"
            );
            cmd.Parameters.AddWithValue(status.status < 3 ? 3 : 2);
            cmd.Parameters.AddWithValue(id);

            var done = await cmd.ExecuteNonQueryAsync();
            if (done > 0)
            {
                return TypedResults.Ok("Du ändrade status på ticketen");
            }
            else { return TypedResults.BadRequest($"Failed to update ticket status"); }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"An error occurred: {ex.Message}");
        }
    }

}



