using MailKit.Net.Smtp;
using MailKit;
using MimeKit;

using System;

namespace server;

class MailService
{
    // APPLÖSEN: yypd gxfy wltl vxic
    //pw till mail inlogg: pig.swinesync at gmail.com (pw: swinesync123)


    public static void SendMail()
    {

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("swinesyncadmin", "pig.swinesync@gmail.com"));
        message.To.Add(new MailboxAddress("Oskar", "oskar.krantz90@gmail.com"));
        message.Subject = "Grymt grymt!";

        message.Body = new TextPart("plain")
        {
            Text = @"Hejsan Svejsan!"
        };


        using (var client = new SmtpClient())
        {
            client.Connect("smtp.gmail.com", 587, false);
            client.Authenticate("pig.swinesync@gmail.com", "yypd gxfy wltl vxic");
            client.Send(message);
            client.Disconnect(true);
        }
    }
}

