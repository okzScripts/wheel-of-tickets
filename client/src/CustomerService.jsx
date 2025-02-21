import "./styles.css"
import { useState, useEffect } from "react";

export default function CustomerService() {
    //const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [yourAssignedTickets, setYourAssignedTickets] = useState([])
    const [tickets, setTickets] = useState([])
    const customerServiceAgent = 2
    const company = 1

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
        <main>
            <section className="upper">
                <div className="rollToGetATicket">
                    <button onClick={randomiser}>Roll to get a ticket</button>
                </div>
            </section>
            <section className="lower">
                <div className="yourTickets">
                    <h2>YOUR TICKETS:</h2>
                        {yourAssignedTickets.length > 0 ? (
                            <ul className="list">
                                {yourAssignedTickets.map((ticket) => (
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
