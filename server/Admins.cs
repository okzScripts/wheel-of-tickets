using Npgsql;

namespace server;

public static class Admins
{
    
    
    
    public static async Task<bool> addAdmin(string name, string email, string password, int company, NpgsqlDataSource db)
    {

        var role = Roles.admin;

        await using var cmd = db.CreateCommand();
            cmd.CommandText ="INSERT INTO users (name, email, password, company, role) VALUES ($1, $2 $3, $4, $5)";

            cmd.Parameters.AddWithValue(name);
            cmd.Parameters.AddWithValue(email);
            cmd.Parameters.AddWithValue(password);
            cmd.Parameters.AddWithValue(company);
            cmd.Parameters.AddWithValue((int)role);

            var result = await cmd.ExecuteScalarAsync();
            if (result != null)
            {
                Console.WriteLine($"Admin created with ID: {result}");
                
                return true;
            }

            Console.WriteLine("Failed to insert admin into database.");
            return false;

    }
    
}

enum Roles
{
    customer = 1,
    support = 2,
    admin = 3,
    superAdmin = 4
}