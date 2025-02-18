import { NavLink, useNavigate, useLocation } from "react-router";
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
    const [company, setCompany] = useState([])
    const navigate = useNavigate();

    function GetCompanies() {
        fetch("/api/companies").then(response =>
            response.json())
            .then(data => setCompanies(data));
    }

    function handleEditCompany(email) {
        fetch(`/api/companies/${email}`)
            .then(response => response.json())
            .then(data => {
                navigate("/super-admin-edit-company", { state: { company: data } }); 
            });
    }

    function BlockCompanyById(email, active) {
        fetch(`/api/companies/block/${email}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(email, active),
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen"), GetCompanies() }
            })
    }

    GetCompanies();

    return <main>
        <h1>All Registered Companies</h1>
        <div className="super-admin-list-container">
            <ul className="super-admin-list">

                {companies.map(company =>
                    <li className="super-admin-list-item" key={company.id}>
                        <div>
                            <p>{company.name}</p>
                            <p>Email: {company.email}</p>
                        </div>
                        <div className="delete-button-div-li">
                            <div className="delete-button-div-li">
                            <button onClick={() => handleEditCompany(company.email)}>Edit</button>
                            <div className="block-button-div-li">
                                <button className="block-button" onClick={() => BlockCompanyById(company.email, company.active)}>{company.active ? "block" : "un-block"}</button>
                            </div>
                    </div>
                        </div>
                    </li>
                )}

            </ul>
        </div>
        <NavLink to="/super-admin"><button className="add-admin-button">Back</button></NavLink>
        <NavLink to="/super-admin-add-company"><button className="add-admin-button">Add Company</button></NavLink>
    </main>;
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
                        type="phone"
                        required
                    />
                </label>
                <label>
                    Description:
                    <input
                        name="description"
                        type="description"
                        required
                    />
                </label>
                <label>
                    Domain:
                    <input
                        name="domain"
                        type="domain"
                        required
                    />
                </label>

                <button type="submit">Save</button>
            </form>
            <NavLink to={"/super-admin-company"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}
export function SuperAdminEditCompanyView() {
    const location = useLocation();
    const company = location.state?.company;

    //admin info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [previousEmail, setPreviousEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [domain, setDomain] = useState("");

    useEffect(() => {
        if (company) {
            setName(company.name || null);
            setEmail(company.email || null);
            setPreviousEmail(company.email || null);
            setPhone(company.phone || null);
            setDescription(company.description || null);
            setDomain(company.domain || null);
        }
    }, [company]);

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
            <form className="adminform" onSubmit={updateCompany} action={`/api/companies/${previousEmail}`} method="PUT">
                <label>
                    Name:
                    <input 
                        name="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required 
                    />
                </label>
                
                <label>
                    Email:
                    <input 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        required 
                    />
                </label>

                <label>
                    Phone:
                    <input 
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="phone" 
                        required 
                    />
                </label>

                <label>
                    Description:
                    <input 
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="description" 
                        required 
                    />
                </label>
                <label>
                    Domain:
                    <input 
                        name="domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        type="domain" 
                        required 
                    />
                </label>

                <button type="submit">Save</button>
            </form>
            <NavLink to="/super-admin-company">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}


export function SuperAdminAdminView() {
    const [admins, setAdmins] = useState([]);
    const [admin, setAdmin] = useState([]);
    const navigate = useNavigate();

    function GetAdmins() {
        fetch("/api/users/3").then(response =>
            response.json())
            .then(data => setAdmins(data));
    }

    function handleEditAdmin(email) {
        fetch(`/api/users/3/${email}`)
            .then(response => response.json())
            .then(data => {
                navigate("/super-admin-edit-admin", { state: { admin: data } }); 
            });
    }

    function BlockAdminById(email, active) {
        fetch(`/api/users/block/${email}/${active}`, {
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
                    <li className="super-admin-list-item" key={admin.id}>
                        <div>
                            <p>{admin.name}</p>
                            <p>Email: {admin.email}</p>
                            <p>Company: {admin.company}</p>
                        </div>
                        <div className="delete-button-div-li">
                            <button onClick={() => handleEditAdmin(admin.email)}>Edit</button>
                            <div className="block-button-div-li">
                                <button className="block-button" onClick={() => BlockAdminById(admin.email, admin.active)}>{admin.active ? "block" : "un-block"}</button>
                            </div>
                    </div></li>
                )}

            </ul>
        </div>
        <NavLink to="/super-admin"><button className="add-admin-button">Back</button></NavLink>
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
export function SuperAdminEditAdminView() {
    const location = useLocation();
    const admin = location.state?.admin;
    const [companies, setCompanies] = useState([]);

    //admin info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [previousEmail, setPreviousEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");

    useEffect(() => {
        fetch("/api/companies")
            .then(response => response.json())
            .then(data => setCompanies(data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    useEffect(() => {
        if (admin) {
            setName(admin.name || null);
            setEmail(admin.email || null);
            setPreviousEmail(admin.email || null);
            setPassword(admin.password || null);
            setCompany(admin.company || null);
        }
    }, [admin]);

    function updateUser(e)
    {
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
            <form className="adminform" onSubmit={updateUser} action={`/api/users/3/${previousEmail}`} method="PUT">
                <label>
                    Name:
                    <input 
                        name="name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required 
                    />
                </label>
                
                <label>
                    Email:
                    <input 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        required 
                    />
                </label>

                <label>
                    Password:
                    <input 
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        required 
                    />
                </label>

                <label>
                    Company:
                    <select 
                        name="company"
                        value={company} // Set value to admin's company
                        onChange={(e) => setCompany(e.target.value)}
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

                <button type="submit">Save</button>
            </form>
            <NavLink to="/super-admin-admin">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}
