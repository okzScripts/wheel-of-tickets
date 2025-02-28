using Npgsql;
using Microsoft.AspNetCore.Http.HttpResults;

namespace server;

public static class MessageRoutes{
    
    public record MessageDTO(int id, string text, DateTime time, int ticket, bool customer);
     public static async Task<Results<Ok<List<MessageDTO>>, BadRequest<string>>> GetTicketMessages(int id, NpgsqlDataSource db)
    {
        List<MessageDTO> messages = new List<MessageDTO>();

        try
        {
            using var cmd = db.CreateCommand(@"
                SELECT m.id, m.text, m.time, m.ticket, m.customer
                FROM messages m 
                WHERE m.ticket = $1 ");

            cmd.Parameters.AddWithValue(id);


            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                messages.Add(new(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetDateTime(2),
                reader.GetInt32(3),
                reader.GetBoolean(4)
                ));

            }

            return TypedResults.Ok(messages);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"Ett fel inträffade: {ex.Message}");
        }
    }


    public record MessageDTO2(string text, DateTime time ,int ticket, bool customer); 
    public static async Task<Results<Ok<string>,BadRequest<string>>> AddMessage(MessageDTO2 message, NpgsqlDataSource db)
    {
        try { 
            using var cmd= db.CreateCommand(@"insert into messages (text,time,ticket,customer)
                                            values ($1,$2,$3,$4) "); 
            cmd.Parameters.AddWithValue(message.text);
            cmd.Parameters.AddWithValue(message.time);
            cmd.Parameters.AddWithValue(message.ticket);
            cmd.Parameters.AddWithValue(message.customer);

            var result= await cmd.ExecuteNonQueryAsync(); 

            if( result>0){
                return TypedResults.Ok("Message recived"); 
            }else 
            {
                return TypedResults.BadRequest("Failed to added"); 
            }
        }catch(Exception ex){
            return TypedResults.BadRequest("Error accessing db" +ex); 
        }
    }

}