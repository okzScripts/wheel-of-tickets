
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import "./styles.css"
import { React, useEffect, useState } from "react";



export default function Company1()
{

    return (
        <main className="form-main">
            <nav className="navbar"><h2>Company1</h2><NavLink to="/companies"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <div>
                <iframe
                    src="http://localhost:5173/customer/addTicket"
                    className="ticket-iframe"
                    title="Customer Ticket View"
                    frameBorder="0"
                    width="40%"
                    height="600px"
                />
                    
                
            </div>
            <section className="content-box">
            </section>
        </main>
    );
}






