using Npgsql;
using server;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

var dataSourceBuilder = new NpgsqlDataSourceBuilder("Host=localhost;Database=swine_sync;Username=postgres;Password=1234;Port=5432");
dataSourceBuilder.MapEnum<UserRole>();
var db = dataSourceBuilder.Build();


builder.Services.AddSingleton<NpgsqlDataSource>(db);
builder.Services.AddSingleton<PasswordHasher<string>>();
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
app.MapPut("/api/users/{id}", UserRoutes.EditAdmin);
app.MapPut("/api/users/block/{id}/{active}", UserRoutes.BlockUser);
app.MapPost("/api/users", UserRoutes.AddAdmin);
app.MapPost("/api/users/agent", UserRoutes.AddAgent);
app.MapPut("/api/users/password/", UserRoutes.ChangePassword);
app.MapPut("/api/users/agent/{id}", UserRoutes.EditAgent);
app.MapPut("/api/users/password/{id}", UserRoutes.ResetPassword);

app.MapPost("/api/login", LoginRoutes.LoginByRole);

app.MapPost("/api/categories", CategoryRoutes.AddCategory);
app.MapPut("/api/categories/status/", CategoryRoutes.ChangeStatus);
app.MapGet("/api/categories/{id}", CategoryRoutes.GetCategoriesByUserId);
app.MapGet("/api/categories/company/", CategoryRoutes.GetCategoriesByCompany);

app.MapGet("/api/products/company/", ProductRoutes.GetProducts);
app.MapGet("/api/products/{ProductId}", ProductRoutes.GetProduct);
app.MapPost("/api/products", ProductRoutes.AddProduct);
app.MapPut("/api/products", ProductRoutes.EditProduct);
app.MapPut("/api/products/block/{id}/{active}", ProductRoutes.BlockProductById);
app.MapGet("/api/products/customer-ticket/", ProductRoutes.GetProductsForTicket);

app.MapGet("/api/tickets/{slug}", TicketRoutes.GetTicket);
app.MapGet("/api/tickets/unassigned", TicketRoutes.GetUnassignedTickets);
app.MapPut("/api/tickets", TicketRoutes.AssignTicket);
app.MapPut("/api/tickets/status/{slug}", TicketRoutes.ChangeStatus);
app.MapGet("/api/tickets/assigned", TicketRoutes.GetAssignedTickets);
app.MapPost("/api/tickets", TicketRoutes.CreateTicket);
app.MapGet("/api/tickets/categories", CompanyRoutes.GetCategories);
app.MapGet("/api/tickets/closed", TicketRoutes.GetClosedTicketsByUserId);
app.MapPut("/api/tickets/rating/{slug}",TicketRoutes.TicketRating );

//ANVÄNDS BARA 1 GÅNG!!!
app.MapPost("/api/password/mockhash/", MockHasher.HashMockPasswords);
app.MapPost("api/password/mockreset/", MockHasher.ResetMockPasswords);
//ANVÄNDS BARA 1 GÅNG!!!

app.MapGet("/api/messages/{slug}", MessageRoutes.GetTicketMessages);
app.MapPost("/api/messages/", MessageRoutes.AddMessage);


app.Run();
