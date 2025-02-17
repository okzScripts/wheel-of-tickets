using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);

Database database = new();

var db = database.Connection();

builder.Services.AddSingleton<NpgsqlDataSource>(db);

var app = builder.Build();
app.MapGet("/api/companies", CompanyRoutes.GetCompanies);
app.MapGet("/api/users/{role}", UserRoutes.GetUsers);
app.MapGet("/api/users/{role}/{email}", UserRoutes.GetUser);
app.MapPut("/api/users/{email}/{active}", UserRoutes.BlockUser);
app.MapPost("/api/users/{role}", UserRoutes.AddUser);


var serverActions  = new ServerActions(app);

app.Run();
