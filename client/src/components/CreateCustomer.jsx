import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router";


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
    
    return ( <>
            <header className="navbar">
                <img src="../assets/logo.png" alt="Logo" className="navbar-logo" />
            </header>
            <main className="ticket-main">
                <div className="ticket-form-container">
                    <form className="ticket-form" onSubmit={handleOnSubmit}>
                        <h4 className="ticket-selection-tag">Create Account</h4>

                        <label className="form-label">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                className="ticket-input"
                            />
                        </label>

                        <label className="form-label">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="ticket-input"
                            />
                        </label>

                        <label className="form-label">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="ticket-input"
                            />
                        </label>

                        <label className="form-label">
                            <input
                                type="password"
                                name="rePassword"
                                value={formData.rePassword}
                                onChange={handleChange}
                                placeholder="Repeat password"
                                className="ticket-input"
                            />
                        </label>

                        <button type="submit" className="ticket-submit-button">
                            Create Account
                        </button>
                    </form>

                    {inputMessage && <p className="input-message">{inputMessage}</p>}
                </div>
            </main>
        </>
    ); 

}
export default CreateCustomer;