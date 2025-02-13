import { NavLink } from "react-router";
import "./styles.css"
import { useEffect, useState } from "react";



export function SuperAdminView() {
    return <main>
        <NavLink to="/superadmincompany"><button className="super-admin-button">Companys</button></NavLink>
        <NavLink to="/superadminadmin"><button className="super-admin-button">Admins</button></NavLink>
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
        <h1>All Registered Companies</h1>
        <div className="company-list-container">
            <ul className="company-list">

                {companies.map(company =>
                    <li className="company-list-item" key={company.id}><div><p>{company.name}</p> <p>Email: {company.email}</p></div><div className="delete-button-div-li"><button>Delete</button></div></li>
                )}

            </ul>
        </div>
    </main>;
}


export function SuperAdminAdminView() {

    const [admins, setAdmins] = useState([]);
    const [admin, setAdmin] = useState([]);

    useEffect(() => {
        fetch("/api/users/3").then(response =>
            response.json())
            .then(data => setAdmins(data));
    }, []);

    useEffect(() => {
        console.log(admin)
    }, [admin]);

    function GetAdmin(email) {
        fetch(`/api/users/3/${email}`).then(response =>
            response.json())
            .then(data => setAdmin(data));
    }

    function BlockAdminById(id) {





    }

    return <main>
        <h1>All Registered Admins</h1>
        <div className="company-list-container">
            <ul className="company-list">

                {admins.map(admin =>
                    <li className="company-list-item" key={admin.id}><div><p>{admin.name}</p> <p>Email: {admin.email}</p><p>Company: {admin.company}</p></div><div className="delete-button-div-li"><button onClick={() => GetAdmin(admin.email)}>Edit</button><div className="block-button-div-li"><button className="block-button" onClick={() => BlockAdminById(admin.email, admin.active)}>{admin.active ? "block" : "un-block"}</button></div>
                    </div></li>
                )}

            </ul>
        </div>
    </main>;
}
