import { NavLink } from "react-router";
import "./styles.css"
import { useEffect, useState } from "react";



export function SuperAdminView() {
    return <main>
        <NavLink to="/super-admin-company"><button className="super-admin-button">Companys</button></NavLink>
        <NavLink to="/super-admin-admin"><button className="super-admin-button">Admins</button></NavLink>
    </main>;
}


export function SuperAdminCompanyView() {

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch("/api/companies").then(response =>
            response.json())
            .then(data => setCompanies(data));
    }, []);

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

    function GetAdmins() {
        fetch("/api/users/3").then(response =>
            response.json())
            .then(data => setAdmins(data));
    }

    function GetAdmin(email) {
        fetch(`/api/users/3/${email}`).then(response =>
            response.json())
            .then(data => setAdmin(data));
    }

    function BlockAdminById(email, active) {
        fetch(`/api/users/${email}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(email, active),
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen"), GetAdmins() }
            })
    }

    GetAdmins();

    return <main>
        <h1 className="super-admin-header">All Registered Admins</h1>
        <div className="super-admin-list-container">
            <ul className="super-admin-list">

                {admins.map(admin =>
                    <li className="super-admin-list-item" key={admin.id}><div><p>{admin.name}</p> <p>Email: {admin.email}</p><p>Company: {admin.company}</p></div><div className="delete-button-div-li"><button onClick={() => GetAdmin(admin.email)}>Edit</button><div className="block-button-div-li"><button className="block-button" onClick={() => BlockAdminById(admin.email, admin.active)}>{admin.active ? "block" : "un-block"}</button></div>
                    </div></li>
                )}

            </ul>
        </div>
        <NavLink to="/super-admin-add-admin"><button className="add-admin-button">Add Admin</button></NavLink>
    </main>;
}

export function SuperAdminAddAdminView() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch("/api/companies")
            .then(response => response.json())
            .then(data => setCompanies(data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    function postUser(e)
    {
        e.preventDefault();
        const form = e.target;

        let data = new FormData(form);
        data = Object.fromEntries(data);
        data.role = 3;
        data = JSON.stringify(data);
        console.log(data)
        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: data
        }) 
    }

    return (
        <main>
            <form className="adminform" onSubmit={postUser} action="/api/users/3" method="POST">
                <label>
                    Name:
                    <input 
                        name="name" 
                        type="text"
                        required 
                    />
                </label>
                
                <label>
                    Email:
                    <input 
                        name="email" 
                        type="email" 
                        required 
                    />
                </label>

                <label>
                    Password:
                    <input 
                        name="password" 
                        type="password" 
                        required 
                    />
                </label>

                <label>
                    Company:
                    <select 
                        name="company"
                        required
                    >
                        <option value="" disabled hidden>Välj ett företag</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </select>
                </label>

                <button type="submit">Save</button>
            </form>
            <NavLink to={"/super-admin-admin"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}
