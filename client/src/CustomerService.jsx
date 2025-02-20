import "./stylesCustomerService.css"
import { useState, useEffect } from "react";

export default function CustomerService() {
    const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([])
    const [tickets, setTickets] = useState([])
    const CustomerServiceAgent = 2

    function GetTickets()
    {
        fetch("/api/tickets")
            .then((response) => response.json())
            .then((data) => setTickets(data))
    }

    useEffect(() => {
        GetTickets()
    })

    function getUnassignedTickets() {
        fetch("/api/tickets/unassigned")
            .then((response) => response.json())
            .then((data) => setUnassignedTickets(data));


    }

    useEffect(() => {
        getUnassignedTickets();
    }, []);


    function randomiser() {

        if (unassignedTickets.length === 0) {
            console.warn("No unassigned tickets available");
            return;
        }

        const newTicket = unassignedTickets[Math.floor(Math.random() * unassignedTickets.length)]
        setTicket(newTicket);
        console.log("Ticket: ", newTicket);
        fetch(`/api/tickets/${CustomerServiceAgent}/${newTicket.id}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ customer_agent: CustomerServiceAgent, id: newTicket.id })
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen"), getUnassignedTickets(), getAssignedTickets() }
            })

    }

    async function getAssignedTickets() {
        const response = await fetch(`/api/tickets/${CustomerServiceAgent}`);
        const data = await response.json();
        setAssignedTickets(data);
    }

    useEffect(() => {
        getAssignedTickets();
    }, []);

    return (
        <main>
            <section className="upper">
                <div className="rollToGetATicket">
                    <button onClick={randomiser}>Roll to get a ticket</button>
                </div>
            </section>
            <section className="lower">
                <div className="yourTickets">
                    <h2>ASSIGNED TICKETS:</h2>
                        {assignedTickets.length > 0 ? (
                            <ul>
                                {assignedTickets.map((ticket) => (
                                    <li key={ticket.id}>
                                        <h2>{ticket.message}</h2>
                                        <p>Ticket id: {ticket.id}</p>
                                        <p>Agent id:{ticket.customer_agent}</p>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <h2>Här var det tomt 😁</h2>
                        )}
                 
                </div>
                <div className="allTickets">
                    <h2>ALL TICKETS:</h2>
                    {tickets.length > 0 ? (
                        <ul>
                            {tickets.map((ticket) => (
                                <li key={ticket.id}>
                                    <h2>{ticket.message}</h2>
                                    <p>Ticket id {ticket.id}</p>
                                    {ticket.customer_agent ?
                                        <p><b>Assigned to: Customer agent</b> {ticket.customer_agent}</p>
                                    : ""}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Inga tickets</p>
                    )}
                </div>
            </section>
        </main>
    );
}
