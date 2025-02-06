
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<User> users = new()
{
    new(1, "Viktor", "indian@gmail.com", "hejhej", "Tombula", "Admin", true),
    new(2, "Jonas", "indian@gmail.com", "hejhej", "Tombula", "Admin", true)
};

app.MapGet("/api/users", GetUsers);
app.MapPost("/api/users", AddUser);

app.Run();


async Task<List<User>> GetUsers()
{
    return users;
}

async Task AddUser(User userdata)
{
    users.Add(userdata);
}

record User(int id, string name, string email, string password, string company, string role, bool active);
