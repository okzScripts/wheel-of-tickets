using Npgsql;
namespace server;


public class Customer
{
    private readonly NpgsqlDataSource db;
    
    public Customer(NpgsqlDataSource db)
    {
        this.db = db;
    }
    
    public async Task AddCustomerAsync(string name, string email,string password )
    {
        var role = Roles.customer;
        await using var cmd = db.CreateCommand();
        cmd.CommandText = "INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4)";

        cmd.Parameters.AddWithValue(name);
        cmd.Parameters.AddWithValue(email);
        cmd.Parameters.AddWithValue(password);
        cmd.Parameters.AddWithValue((int)role);

        await cmd.ExecuteNonQueryAsync();

        
    }
}