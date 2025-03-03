using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);

var dataSourceBuilder = new NpgsqlDataSourceBuilder("Host=localhost;Database=swine_sync;Username=postgres;Password=admin132;Port=5432");
dataSourceBuilder.MapEnum<UserRole>();
var db = dataSourceBuilder.Build();


builder.Services.AddSingleton<NpgsqlDataSource>(db);
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => { options.Cookie.IsEssential = true; });




var app = builder.Build();

app.UseSession();


app.MapGet("/api/companies", CompanyRoutes.GetCompanies);
app.MapGet("/api/companies/{id}", CompanyRoutes.GetCompany);
app.MapPost("/api/companies", CompanyRoutes.AddCompany);
app.MapPut("/api/companies/{id}", CompanyRoutes.EditCompany);
app.MapPut("/api/companies/block/{id}/{active}", CompanyRoutes.BlockCompany);

app.MapGet("/api/roles/users/{role}", UserRoutes.GetUsers);

app.MapGet("/api/users/company/{role}", UserRoutes.GetUsersFromCompany);
app.MapGet("/api/users/{id}", UserRoutes.GetUser);
app.MapPut("/api/users/{id}", UserRoutes.EditUser);
app.MapPut("/api/users/block/{id}/{active}", UserRoutes.BlockUser);
app.MapPost("/api/users", UserRoutes.AddUser);
app.MapPost("/api/login", LoginRoutes.LoginByRole);

app.MapGet("/api/products/company/{company}", ProductRoutes.GetProducts);
app.MapGet("/api/products/{ProductId}", ProductRoutes.GetProduct);
app.MapPost("/api/products", ProductRoutes.AddProduct);
app.MapPut("/api/products", ProductRoutes.EditProduct);
app.MapPut("/api/products/block/{id}/{active}", ProductRoutes.BlockProductById);

app.MapGet("/api/tickets/{id}", TicketRoutes.GetTicket);
app.MapGet("/api/tickets/unassigned", TicketRoutes.GetUnassignedTickets);
app.MapPut("/api/tickets/{id}", TicketRoutes.AssignTicket);
app.MapPut("/api/tickets/status/{id}", TicketRoutes.ChangeStatus);
app.MapGet("/api/tickets/assigned", TicketRoutes.GetAssignedTickets);
app.MapPost("/api/tickets", TicketRoutes.CreateTicket);
app.MapGet("/api/tickets/categories", CompanyRoutes.GetCategories);

app.MapGet("/api/messages/{id}", MessageRoutes.GetTicketMessages);
app.MapPost("/api/messages/", MessageRoutes.AddMessage);

app.Run();
