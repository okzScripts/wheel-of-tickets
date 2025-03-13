
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import "./styles.css"
import { React, useEffect, useState } from "react";



export default function TechSolutions()
{
    const companyId = 2;
    
    

    return (
        <main className="form-main">
            <h2>Tech Solutions</h2>
            <div>
                <iframe
                    src = {`http://localhost:5173/customer/addTicket?companyId=${companyId}`}
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






