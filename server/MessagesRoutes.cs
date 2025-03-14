using Microsoft.AspNetCore.Authentication;
using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace server;

public static class MessageRoutes
{

    public record MessageDTO(int id, string text, string time, int ticket, bool customer);
    public static async Task<Results<Ok<List<MessageDTO>>, BadRequest<string>>> GetTicketMessages(string slug, NpgsqlDataSource db)
    {
        List<MessageDTO> messages = new List<MessageDTO>();

        try
        {

            await using var conn = await db.OpenConnectionAsync();
            await using var transaction = await conn.BeginTransactionAsync();

            int? ticketId;
            int? result;
            var sql1 = "SELECT id FROM tickets WHERE slug = $1";
            using (var cmd1 = new NpgsqlCommand(sql1, conn, transaction))
            {
                cmd1.Parameters.AddWithValue(slug);
                result = (int?)await cmd1.ExecuteScalarAsync();

                if (!result.HasValue)
                {
                    await transaction.DisposeAsync();
                    return TypedResults.BadRequest("No ticket found whit this slug");
                }
                else
                {
                    ticketId = result.Value;
                }
            }

            var sql2 = "SELECT m.id, m.text, m.time, m.ticket, m.customer FROM messages m WHERE m.ticket = $1 ";
            using (var cmd2 = new NpgsqlCommand(sql2, conn, transaction))
            {
                cmd2.Parameters.AddWithValue(ticketId);
                using var reader = await cmd2.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {

                    var formattedTime = reader.GetDateTime(2).ToString("yyyy/MM/dd HH:mm");

                    messages.Add(new(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        formattedTime,
                        reader.GetInt32(3),
                        reader.GetBoolean(4)
                    ));

                }
            }
            await transaction.DisposeAsync();
            return TypedResults.Ok(messages);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }

    public static async Task<int?> GetIdBySlug(NpgsqlDataSource db, string slug)
    {

        int? result;

        try
        {
            using var cmd = db.CreateCommand("SELECT id FROM tickets WHERE slug = $1");
            cmd.Parameters.AddWithValue(slug);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                result = reader.GetInt32(0);
                return result;
            }
            return -1;
        }
        catch
        {
            return -1;
        }

    }




    public record MessageDTO2(string text, string slug, bool customer);
    public static async Task<Results<Ok<string>, BadRequest<string>>> AddMessage(MessageDTO2 message, NpgsqlDataSource db)
    {

        int? ticketId = await GetIdBySlug(db, message.slug);

        try
        {
            using var cmd = db.CreateCommand(@"insert into messages (text,time,ticket,customer)
                                            values ($1,$2,$3,$4) ");
            cmd.Parameters.AddWithValue(message.text);
            cmd.Parameters.AddWithValue(DateTime.Now);
            cmd.Parameters.AddWithValue(ticketId);
            cmd.Parameters.AddWithValue(message.customer);

            var result = await cmd.ExecuteNonQueryAsync();

            if (result > 0)
            {
                return TypedResults.Ok("Message recived");
            }
            else
            {
                return TypedResults.BadRequest("Failed to added");
            }
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest("Error accessing db" + ex);
        }
    }

}