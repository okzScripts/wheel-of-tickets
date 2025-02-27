import "./styles.css"
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import logo from './assets/logo.png';

export default function CustomerService() {
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
        console.log(result);
    await GetUnassignedTickets();
    await GetAssignedTickets();
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
                                {assignedTickets.map((ticket) => (
                                    <li key={ticket.id} className="ticket-list-item">
                                        <h2>{ticket.customer_url}</h2>
                                        <div className="ticket-info">
                                        <p>Ticket id: {ticket.id}</p>
                                            <p>Agent id:{ticket.customer_agent}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <ul className="ticket-list"><div className="ticket-list-item"><div className="ticket-info"><p>Inga tickets</p></div></div></ul>
                        )}
                 
                </div>
                <div className="tickets-right">
                    <h2>ALL TICKETS:</h2>
                    {unassignedTickets.length > 0 ? (
                        <ul className="ticket-list">
                            {unassignedTickets.map((ticket) => (
                                <li key={ticket.id} className="ticket-list-item">
                                    <h2>{ticket.customer_url}</h2>
                                    <div className="ticket-info">
                                        <p>Ticket id {ticket.id}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="ticket-list"><div className="ticket-list-item"><div className="ticket-info"><p>Inga tickets</p></div></div></ul>
                    )}
                </div>
            </section>
        </main>
    );
}
