import { NavLink } from "react-router";
import "./styles.css"
import { useEffect, useState } from "react";



export function SuperAdminView() {
    return <main>
        <NavLink to="/superadmincompany"><button className="super-admin-button">Companys</button></NavLink>
        <button className="super-admin-button">Admins</button>
    </main>;
}

export function SuperAdminCompanyView() {

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch("/api/companies").then(response =>
            response.json())
            .then(data => setCompanies(data));
    }, []);


    useEffect(() => {
        companies.map(company => {
            console.log(company.id);
            console.log(company.name);
        });

    }, [companies]);



    return <main>
        <h1>Companyview</h1>
        <div className="company-list-container">
            <ul className="company-list">

                {companies.map(company =>
                    <li key={company.id}>{company.id} {company.name} <br></br> email: {company.email} </li>)}

            </ul>
        </div>
    </main>;
}
