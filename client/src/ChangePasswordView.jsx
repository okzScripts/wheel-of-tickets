import { BrowserRouter, NavLink, useFetcher, useNavigate, useLocation, useParams } from "react-router";
import { createContext, useEffect, useState, use } from "react";
import logo from './assets/logo.png';

export function ChangePasswordView() {
    const { id } = useParams();
    const [user, setUser] = useState({});


    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => {setUser(data)});
    },[]);

   

    function updatePassword(e) {
        e.preventDefault();

        
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        if(dataObject.password!==dataObject.repeat_password){
            alert("Passwords do not match"); 
        }else{
            let dataJson = JSON.stringify(dataObject);
            fetch(form.action, {
                headers: { "Content-Type": "application/json" },
                method: "PUT",
                body: dataJson
            }).then(response => {
                if (response.ok) {
                    alert(`Du updaterade ${dataObject.name} `);
                } else {
                    alert("Något gick fel ");
                }
            })
        }
        }

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/agents"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={updatePassword} action={`/api/users/password/`} method="PUT">
                <div className="form-box">
                        <input
                            name="old_password"
                            placeholder="current password"
                            type="password"
                            required
                        />
                       
                        <input
                            name="password"
                            placeholder="new password"
                            type="text"
                            required
                        />
                    <input
                            name="repeate_password"
                            type="email"
                            placeholder="repeate new password"
                            required
                        />
                </div>
                <input type="submit" value="Save" className="middle-button"></input>
            </form>
        </main>
    );
}