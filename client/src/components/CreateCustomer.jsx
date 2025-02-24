import React, {useState} from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router";
import logo from '../assets/logo.png';


const CreateCustomer = () => 
{
    const [formData, setFormData] = useState({
        name:"",        
        email:"",
        password:"",
        rePassword:""
    });
    const [inputMessage, setInputMessage] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({ ...prevData, [name]:value}));
    };
    
    
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.rePassword) {
            setInputMessage("Passwords do not match");
            return;
        }
        
        const requestBody ={
            Name: formData.name,
            Email: formData.email,
            Password: formData.password,            
            Role: 1        
        }
        
        try {

            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok){
                throw new Error("User not created");
            }

            setInputMessage("User created successfully");               

                
        } catch (error){
            setInputMessage(error.inputMessage)
        }
    };    
    
    return (<main>
        <nav className="navbar"><img src={logo}></img></nav>
        <form className="data-form" onSubmit={handleOnSubmit}>
            <div className="form-box">
                        <label>
                                Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className="ticket-input"
                            />
                        </label>

                <label>
                    Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="ticket-input"
                            />
                        </label>

                <label>
                    Password:
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="ticket-input"
                            />
                        </label>

                <label>
                    Repeat Password:
                            <input
                                type="password"
                                name="rePassword"
                                value={formData.rePassword}
                                onChange={handleChange}
                                placeholder="Repeat password"
                                className="ticket-input"
                            />
                        </label>
                        </div>
                            <input type="submit" className="middle-button" value="Create Account">
                            </input>
                        
                    </form>
            </main>
    ); 

}
export default CreateCustomer;