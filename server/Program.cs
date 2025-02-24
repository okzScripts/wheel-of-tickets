using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);

Database database = new();

var db = database.Connection();

builder.Services.AddSingleton<NpgsqlDataSource>(db);

var app = builder.Build();
app.MapGet("/api/companies", CompanyRoutes.GetCompanies);
app.MapGet("/api/companies/{id}", CompanyRoutes.GetCompany);
app.MapPost("/api/companies", CompanyRoutes.AddCompany);
app.MapPut("/api/companies/{id}", CompanyRoutes.EditCompany);
app.MapPut("/api/companies/block/{id}/{active}", CompanyRoutes.BlockCompany);

app.MapGet("/api/roles/users/{role}", UserRoutes.GetUsers);

app.MapGet("/api/users/company/{role}/{company}", UserRoutes.GetUsersFromCompany);
app.MapGet("/api/users/{id}", UserRoutes.GetUser);
app.MapPut("/api/users/{id}", UserRoutes.EditUser);
app.MapPut("/api/users/block/{id}/{active}", UserRoutes.BlockUser);
app.MapPost("/api/users", UserRoutes.AddUser);

app.MapGet("/api/products/company/{company}", ProductRoutes.GetProducts);
app.MapGet("/api/products/{ProductId}", ProductRoutes.GetProduct);
app.MapPost("/api/products", ProductRoutes.AddProduct);
app.MapPut("/api/products", ProductRoutes.EditProduct);
app.MapPut("/api/products/block/{id}/{active}", ProductRoutes.BlockProductById);

app.MapGet("/api/tickets/{company}", TicketRoutes.GetTickets);
app.MapGet("/api/tickets/{company}/unassigned", TicketRoutes.GetUnassignedTickets);
app.MapPut("/api/tickets/{id}/{customer_agent}", TicketRoutes.AssignTicket);
app.MapGet("/api/tickets/{company}/{customer_agent}", TicketRoutes.GetAssignedTickets);
app.MapPost("/api/customerTicket", TicketRoutes.CreateTicket);
app.MapGet("/api/tickets/unassigned", TicketRoutes.GetUnassignedTickets);
app.MapPut("/api/tickets/{customer_agent}/{id}", TicketRoutes.AssignTicket);
app.MapGet("/api/tickets/{customer_agent}", TicketRoutes.GetAssignedTickets);

app.MapGet("/api/categories", CompanyRoutes.GetCategories);

//app.MapPost("/api/create-user", UserRoutes.AddUser);


//var serverActions  = new ServerActions(app);

app.Run();
