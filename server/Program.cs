using server; 


var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var login= new Login(); 

var role= login.CheckLogin("kalle@anka.com", "1234"); 

System.Console.WriteLine(role);
app.MapGet("/", () => "Hello World!");

app.Run();
