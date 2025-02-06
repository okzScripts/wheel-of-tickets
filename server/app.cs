namespace server;



public class app
{
    private List<users> Users = new List<users>{new users("kalle@anka.com", "1234", Roles.admin),
                                                 {new users("peter@nicklas.com", "1234", Roles.admin)},
                                                 {new users("donald@anka.com", "1234", Roles.admin)}};

}

record users(string email, string passWord, Roles role);

enum Roles
{
    admin,
    customer,
    support
}