import "./styles.css"
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import logo from './assets/logo.png';

export function CustomerServiceView() {
    //const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const customerServiceAgent = 1;

    useEffect(GetUnassignedTickets);

    
  
    function GetUnassignedTickets()
    {
        fetch("/api/tickets/unassigned/" + customerServiceAgent )
            .then((response) => response.json())
            .then((data) => setUnassignedTickets(data))
    }

    function GetAssignedTickets(){
        fetch("/api/tickets/assigned/" + customerServiceAgent )
        .then((response) => response.json())
        .then((data) => setAssignedTickets(data))
    }

    useEffect(GetAssignedTickets); 



    async function randomiser() {
    if (unassignedTickets.length === 0) {
        console.error("No unassigned tickets available.");
        return;
    }

    const randomTicket = unassignedTickets[Math.floor(Math.random() * unassignedTickets.length)];

    if (!randomTicket) {
        console.error("Failed to select a random ticket.");
        return;
    }

    try {
        const response = await fetch(`/api/tickets/${randomTicket.id}/${customerServiceAgent}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
        });
        const result = await response.text();
    
        GetUnassignedTickets();
        GetAssignedTickets();
    } catch (error) {
        console.error("Error assigning ticket:", error);
    }
}


    return (
        <main className="form-main">
            <nav className="navbar"><img src={logo}></img></nav>
            <section className="upper-section">
                <div className="rollToGetATicket">
                    <button onClick={randomiser} className="middle-button">Roll to get a ticket</button>
                </div>
            </section>
            <section className="lower-section">
                <div className="tickets-left">
                    <h2>YOUR TICKETS:</h2>
                        {assignedTickets.length > 0 ? (
                            <ul className="ticket-list">
                                {assignedTickets.map(TicketCard)}
                            </ul>

                        ) : (
                            <ul className="ticket-list"><li className="ticket-list-item" key={"emptyassigned"}><div className="ticket-info"><p>Inga tickets</p></div></li></ul>
                        )}
                 
                </div>
                <div className="tickets-right">
                    <h2>ALL TICKETS:</h2>
                    {unassignedTickets.length > 0 ? (
                        <ul className="ticket-list">
                            {unassignedTickets.map(TicketCard)}
                        </ul>
                    ) : (
                            <ul className="ticket-list"><li className="ticket-list-item" key={"emptyunnasigned"}><div className="ticket-info"><p>Inga tickets</p></div></li></ul>
                    )}
                </div>
            </section>
        </main>
    );
    function TicketCard(ticket) {
        return<li key={ticket.id} className="ticket-list-item"><NavLink to={"/customer-service/"+ticket.id+"/ticket-info"} >
            
            <h2>{ticket.customer_url}</h2>
            <div className="ticket-info">
                <p>Ticket id: {ticket.id}</p>
            </div></NavLink> 
        </li>
    
    }
}


export function TicketInfoView() {
 
    return (
<main className="chat-main">
<nav className="navbar"><img src={logo}></img> <NavLink to="/customer-service"><button className="back-button">⬅️ Back</button></NavLink></nav>
<section className="chat-header"><h1>HejHej</h1></section>
<section className="chat">
<ul className="chat-ul">
<li className="chat-customer-message">Hejhej</li>
<li className="chat-agent-message">Hallå!</li>
</ul>
</section>
<section className="chat-message-box">
<input type="textarea"></input>
</section>

 
            <section className="content-box">
</section>
</main>
    );
}
