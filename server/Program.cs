using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

Database database = new();

var db = database.Connection();

var serverActions  = new ServerActions(app);

app.Run();
