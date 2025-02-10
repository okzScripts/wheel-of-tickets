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
       
    }
    
}