import { useState, useEffect } from "react";

export default function CustomerService() {
    const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const CustomerServiceAgent = 2

    function getUnassignedTickets() {
        fetch("/api/tickets/unassigned")
            .then((response) => response.json())
            .then((data) => setUnassignedTickets(data));


    }

    useEffect(() => {
        getUnassignedTickets();
    }, []);


    // function getRandomTicket() {
    //     fetch("/api/tickets/random")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setTicket(data);
    //         });

    // }

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
        getUnassignedTickets();

    }

    return (
        <main>
            <section className="rollToGetATicket">
                <div>
                    <button onClick={randomiser}>Roll to get a ticket</button>
                </div>
            </section>
            <section className="tickets">
                <div className="yourTickets">

                    <div>
                        {ticket ? (
                            <>
                                <h2>{ticket.message}</h2>
                                <p>ID: {ticket.id}</p>
                                <p>customer agent: {ticket.customer_agent}</p>
                            </>
                        ) : (
                            <h2>Här var det tomt 😁</h2>
                        )}
                    </div>
                </div>
                <div className="notAssignedTickets">
                    {unassignedTickets.length > 0 ? (
                        <ul>
                            {unassignedTickets.map((ticket) => (
                                <li key={ticket.id}>
                                    <h2>{ticket.message}</h2>
                                    <p>ID: {ticket.id}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p> Inga tickets</p>
                    )}
                </div>
            </section>
        </main>
    );
}
