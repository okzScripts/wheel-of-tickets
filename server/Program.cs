
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<User> users = new()
{
    new(1, "Viktor", "indian@gmail.com", "hejhej", "Tombula", "Admin", true),
    new(2, "Jonas", "indian@gmail.com", "hejhej", "Tombula", "Admin", true)
};

app.MapGet("/api/users", GetUsers);
app.MapPost("/api/users", AddUser);
app.MapPut("/api/users/{id}", UpdateAdminStatus);

app.Run();


async Task<List<User>> GetUsers()
{
    return users;
}

async Task AddUser(User userdata)
{
    users.Add(userdata);
}

async Task UpdateAdminStatus(int id)
{
    var usersIndex = users.FindIndex(u => u.id == id);
    users[usersIndex] = users[usersIndex] with { active = false };

}



record User(int id, string name, string email, string password, string company, string role, bool active);
