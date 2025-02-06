using server;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();



Login login = new Login();

var role = login.CheckLogin("kalle@anka.com", "1234");

System.Console.WriteLine(role);
app.MapGet("/api/login", (HttpRequest request) =>
{
    return login.CheckLogin(email, password);
}
);



app.Run();
