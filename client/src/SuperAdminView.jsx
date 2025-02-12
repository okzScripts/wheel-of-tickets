import { NavLink } from "react-router";
import "./styles.css"
import { useState } from "react";



export function SuperAdminView() {
    return <main>
        <NavLink to="/superadmincompany"><button className="super-admin-button">Companys</button></NavLink>
        <button className="super-admin-button">Admins</button>
    </main>;
}

export function SuperAdminCompanyView() {

    const [admins,setAdmins] = useState([]);
    

    return <main>
        <h1>Companyview</h1>
        <div className="company-list-container">
            <ul className="company-list">

            </ul>
        </div>
    </main>;
}
