using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);






Database database = new();

var db = database.Connection();

builder.Services.AddSingleton<NpgsqlDataSource>(db);

var app = builder.Build();
app.MapGet("/api/companies", CompanyRoutes.GetCompanies);

app.Run();
