import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import "./styles.css"
import { useEffect, useState } from "react";



export function SuperAdminView() {
    return <main>
        <NavLink to="/companies"><button className="super-admin-button">Companies</button></NavLink>
        <NavLink to="/admins"><button className="super-admin-button">Admins</button></NavLink>
    </main>;
}


export function SuperAdminCompanyView() {
    const [companies, setCompanies] = useState([]);

    function GetCompanies() {
        fetch("/api/companies").then(response =>
            response.json())
            .then(data => setCompanies(data));
    }



    function BlockCompanyById(id, active) {
        fetch(`/api/companies/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(id, active),
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen"), GetCompanies() }
            })
    }

    useEffect(GetCompanies);

    return <main>
        <h1>All Registered Companies</h1>
        <div className="super-admin-list-container">
            <ul className="super-admin-list">
                {companies.map(CompanyCard)}
            </ul>
        </div>
        <NavLink to="/super-admin"><button className="add-admin-button">Back</button></NavLink>
        <NavLink to="/companies/add"><button className="add-admin-button">Add Company</button></NavLink>
    </main>;

    function CompanyCard(company) {
        return <li className="super-admin-list-item" key={company.id}>
            <div>
                <p>{company.name}</p>
                <p>Email: {company.email}</p>
            </div>
            <div className="delete-button-div-li">
                <div className="delete-button-div-li">
                    <NavLink to={"/companies/" + company.id + "/edit"}><button>Edit</button></NavLink>
                    <div className="block-button-div-li">
                        <button className="block-button" onClick={() => BlockCompanyById(company.id, company.active)}>{company.active ? "block" : "un-block"}</button>
                    </div>
                </div>
            </div>
        </li>
    }
}
export function SuperAdminAddCompanyView() {

    function postCompany(e) {
        e.preventDefault();
        const form = e.target;
        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        let dataJson = JSON.stringify(dataObject);

        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du lade till ${dataObject.name} i databasen 🎉`);
            } else {
                alert("Något gick fel ❌");
            }
        });
    }

    return (
        <main>
            <form className="adminform" onSubmit={postCompany} action="/api/companies" method="POST">
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
                    Phone:
                    <input
                        name="phone"
                        type="tel"
                        required
                    />
                </label>
                <label>
                    Description:
                    <input
                        name="description"
                        type="text"
                        required
                    />
                </label>
                <label>
                    Domain:
                    <input
                        name="domain"
                        type="url"
                        required
                    />
                </label>

                <button type="submit">Save</button>
            </form>
            <NavLink to={"/companies"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}
export function SuperAdminEditCompanyView() {
    const [company, setCompany] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch("/api/companies/" + id).then(response => response.json()).then(data => { setCompany(data) })
    })

    function updateCompany(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        let dataJson = JSON.stringify(dataObject);
        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du updaterade ${dataObject.name}'s information 🎉`);
            } else {
                alert("Något gick fel ❌");
            }
        })
    }

    return (
        <main>
            <form className="adminform" onSubmit={updateCompany} action={`/api/companies/${id}`} method="PUT">
                <label>
                    Name:
                    <input
                        name="name"
                        defaultValue={company?.name}
                        type="text"
                        required
                    />
                </label>

                <label>
                    Email:
                    <input
                        name="email"
                        defaultValue={company?.email}
                        type="email"
                        required
                    />
                </label>

                <label>
                    Phone:
                    <input
                        name="phone"
                        defaultValue={company?.phone}
                        type="tel"
                        required
                    />
                </label>

                <label>
                    Description:
                    <input
                        name="description"
                        defaultValue={company?.description}
                        type="text"
                        required
                    />
                </label>
                <label>
                    Domain:
                    <input
                        name="domain"
                        defaultValue={company?.domain}
                        type="url"
                        required
                    />
                </label>

                <input type="submit" value="Save" />
            </form>
            <NavLink to="/companies">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}


export function SuperAdminAdminView() {
    const [admins, setAdmins] = useState([]);





    function GetAdmins() {
        fetch("/api/roles/users/3").then(response =>
            response.json())
            .then(data => setAdmins(data));
    }



    function BlockAdminById(id, active) {
        fetch(`/api/users/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(id, active),
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

                {admins.map(AdminCard

                )}

            </ul>
        </div>
        <NavLink to="/super-admin"><button className="add-admin-button">Back</button></NavLink>
        <NavLink to="/admins/add"><button className="add-admin-button">Add Admin</button></NavLink>
    </main>;


    function AdminCard(admin) {

        return <li className="super-admin-list-item" key={admin.id}>
            <div>
                <p>{admin.name}</p>
                <p>Email: {admin.email}</p>
                <p>Company: {admin.company}</p>
            </div>
            <div className="delete-button-div-li">
                <NavLink to={"/users/" + admin.id + "/edit"}><button>Edit</button></NavLink>
                <div className="block-button-div-li">
                    <button className="block-button" onClick={() => BlockAdminById(admin.id, admin.active)}>{admin.active ? "block" : "un-block"}</button>
                </div>
            </div></li>

    }
}
export function SuperAdminAddAdminView() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch("/api/companies")
            .then(response => response.json())
            .then(data => setCompanies(data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    function postUser(e) {
        e.preventDefault();
        const form = e.target;
        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.role = 3;

        let dataJson = JSON.stringify(dataObject);

        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du lade till ${dataObject.name} i databasen 🎉`);
            } else {
                alert("Något gick fel ❌");
            }
        });
    }

    return (
        <main>
            <form className="adminform" onSubmit={postUser} action="/api/users" method="POST">
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

                <input type="submit" value="Save"></input>
            </form>
            <NavLink to={"/admins"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}
export function SuperAdminEditAdminView() {
    const { id } = useParams()
    const [companies, setCompanies] = useState([]);
    const [admin, setAdmin] = useState(null);


    useEffect(() => {
        fetch("/api/companies")
            .then(response => response.json())
            .then(data => setCompanies(data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    useEffect(() => {
        fetch("/api/users/" + id)
            .then(response => response.json())
            .then(data => { setAdmin(data) })
            .catch(error => console.error("Error fetching user:", error));

    })


    function updateUser(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.role = 3;
        let dataJson = JSON.stringify(dataObject);
        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du updaterade ${dataObject.name}'s information 🎉`);
            } else {
                alert("Något gick fel ❌");
            }
        })
    }

    return (
        <main>
            <form className="adminform" onSubmit={updateUser} action={`/api/users/${id}`} method="PUT">
                <label>
                    Name:
                    <input
                        name="name"
                        defaultValue={admin?.name}
                        type="text"
                        required
                    />
                </label>

                <label>
                    Email:
                    <input
                        name="email"
                        defaultValue={admin?.email}
                        type="email"
                        required
                    />
                </label>

                <label>
                    Password:
                    <input
                        name="password"
                        defaultValue={admin?.password}
                        type="password"
                        required
                    />
                </label>

                <label>
                    Company:
                    <select
                        name="company"
                        defaultValue={admin?.company}
                        required
                    >
                        <option value="" disabled hidden>Välj ett företag</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <input type="submit">Save</input>
            </form>
            <NavLink to="/admins">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}
