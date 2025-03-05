import "./../styles.css"
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import logo from './../assets/logo.png';


export function CustomerChatView() {
    const { id } = useParams()
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]); 
    const [ticket, setTicket] = useState({});
    
    function GetTicketMessages() {
        fetch(`/api/messages/${id}`).then(response => response.json()).then(data => { setMessages(data) })
    }
    useEffect(GetTicketMessages, [])

    useEffect(() => {
    const intervalId = setInterval(GetTicketMessages, 2000);
    return () => clearInterval(intervalId);
    }, []);

    useEffect(()=> console.log("hej"),[]);

    function PostMessage(e) {
        e.preventDefault(); 
        const form=e.target; 
        let formData=new FormData(form); 
        let dataObject= Object.fromEntries(formData)
        dataObject.ticket=id; 
        dataObject.customer=true;
        
        let dataJson =JSON.stringify(dataObject); 
        console.log(dataJson);
        fetch("/api/messages", 
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: dataJson
            }).then(response => {
                if (response.ok) {
                    GetTicketMessages();
                    setMessageText("")
                } else {
                    console.log(response)
                    alert("respons");
                }
            })
            
    }
    useEffect(GetTicket, [])

    function GetTicket() {
         fetch("/api/tickets/" + id).then(response => response.json()).then(data => setTicket(data))
    }

    function ChangeStatus() {
        fetch("/api/tickets/status/" + id, 
            {
                headers: { "Content-Type": "application/json" },
                method: "PUT",
                body: JSON.stringify({ status: ticket.status }),
            }).then(response => {
                if (response.ok) {
                    GetTicket();
                } else {
                    console.log(response)
                    alert("respons");
                }
            })
    }
    
    return (
<main className="chat-main">
<nav className="navbar"><img src={logo}></img></nav>
<section className="chat-header"><h1>Chat about your Ticket</h1></section>
<section className="chat">
<ul className="chat-ul"> {messages.map(MessageCard)}
</ul>
</section>
<section className="chat-message-box">
<form  className="chat-message-form" onSubmit={PostMessage} method="POST" >
                    <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} name="text" type="textarea" className="text-area"></textarea>
                    <input className="small-button" type="submit" value="Send" disabled={!messageText || ticket.status > 2 }></input>
                </form>
                <button className="small-button" onClick={ChangeStatus} disabled={ticket.status > 2 }>{ ticket.status < 3  ? "Close Ticket": "Closed" }</button>
</section>
</main>
    );

    function MessageCard(message) {
        const messageSender = message.customer ?  "chat-agent-message"   : "chat-customer-message" 
        const messageholder = message.customer?   "message-holder-agent" : "message-holder-customer"
        return <li key={message.id} className={messageSender}><p className={messageholder}>{message.text}</p><p>{message.time}</p></li>
    }
}
