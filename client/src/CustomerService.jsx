import { useState, useEffect } from "react";

export default function CustomerService() {
    const [ticket, setTicket] = useState(null);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const CustomerServiceAgent = 2
 
    function getUnassignedTickets()
    {
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
    
    function randomiser(unassignedTickets)
    {
        const ticket = unassignedTickets[Math.floor(Math.random() * unassignedTickets.length)]
        console.log(ticket.id)
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
                            <p>customer agent: {ticket.customer_agent }</p>
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
