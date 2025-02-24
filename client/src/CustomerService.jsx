import "./styles.css"
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import logo from './assets/logo.png';

export default function CustomerService() {
    //const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [yourAssignedTickets, setYourAssignedTickets] = useState([])
    const [tickets, setTickets] = useState([])
    const customerServiceAgent = 29
    const company = 2

    useEffect(() => {
        GetTickets()
    })

    useEffect(() => {
        getUnassignedTickets();
    }, []);
    
    useEffect(() => {
        getYourAssignedTickets();
    }, []);
  
    function GetTickets()
    {
        fetch("/api/tickets/" + company )
            .then((response) => response.json())
            .then((data) => setTickets(data))
    }


    function getUnassignedTickets() {
        fetch("/api/tickets/" + company + "/unassigned")
            .then((response) => response.json())
            .then((data) => setUnassignedTickets(data));
    }

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
    await GetTickets();
    await getUnassignedTickets();
    await getYourAssignedTickets();
    } catch (error) {
        console.error("Error assigning ticket:", error);
    }
}

    async function getYourAssignedTickets() {
        const response = await fetch("/api/tickets/" + company + "/" + customerServiceAgent);
        const data = await response.json();
        setYourAssignedTickets(data);
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
                        {yourAssignedTickets.length > 0 ? (
                            <ul className="ticket-list">
                                {yourAssignedTickets.map((ticket) => (
                                    <li key={ticket.id} className="ticket-list-item">
                                        <h2>{ticket.message}</h2>
                                        <div className="ticket-info">
                                        <p>Ticket id: {ticket.id}</p>
                                            <p>Agent id:{ticket.customer_agent}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <h2>Här var det tomt 😁</h2>
                        )}
                 
                </div>
                <div className="tickets-right">
                    <h2>ALL TICKETS:</h2>
                    {tickets.length > 0 ? (
                        <ul className="ticket-list">
                            {tickets.map((ticket) => (
                                <li key={ticket.id} className="ticket-list-item">
                                    <h2>{ticket.message}</h2>
                                    <div className="ticket-info">
                                        <p>Ticket id {ticket.id}</p>
                                        {ticket.customer_agent ? <p><b>Assigned to: Customer agent</b> {ticket.customer_agent}</p> : ""}
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
