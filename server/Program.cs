using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);






Database database = new();

var db = database.Connection();

builder.Services.AddSingleton<NpgsqlDataSource>(db);

var app = builder.Build();
app.MapGet("/api/companies", CompanyRoutes.GetCompanies);
app.MapGet("/api/users/{admins}", UserRoutes.GetAdmins);
app.MapGet("/api/users/{admins}/{email}", UserRoutes.GetAdmin);
app.MapPut("/api/users/{email}/{active}", UserRoutes.BlockAdmin);
app.Run();
