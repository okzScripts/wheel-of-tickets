import { NavLink } from "react-router";
import "./styles.css"



export function SuperAdminView() {
    return <main>
        <NavLink to="/superadmincompany"><button className="super-admin-button">Companys</button></NavLink>
        <button className="super-admin-button">Admins</button>
    </main>;
}

export function SuperAdminCompanyView() {
    return <main>
        <h1>Companyview</h1>
    </main>;
}
