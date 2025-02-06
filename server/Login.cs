namespace server;



public class Login
{
    private List<Persons> persons = new List<Persons>{new Persons("kalle@anka.com", "1234", Roles.admin),
                                                 new Persons("peter@nicklas.com", "1234", Roles.support),
                                                 new Persons("donald@anka.com", "1234", Roles.customer)};
    public Login()
    {

    }

    public string CheckLogin(string inputEmail, string inputPassword)
    {
        foreach (var peon in persons)
        {
            if (inputEmail == peon.email && inputPassword == peon.passWord)
            {
                return peon.role.ToString();
            }
        }
        return "no match";
    }

}


record Persons(string email, string passWord, Roles role);

enum Roles
{
    admin,
    customer,
    support
}