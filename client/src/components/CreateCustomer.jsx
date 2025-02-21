import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";


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
    
    return (<>
            <header>Logga</header>
            <main>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        <input type="text"
                               name="name"
                               value={formData.name}
                               onChange={handleChange}
                               placeholder="Enter name:"/>
                    </label>

                    <label>
                        <input type="email"
                               name="email"
                               value={formData.email}
                               onChange={handleChange}
                               placeholder="Enter email:"/>
                    </label>

                    <label>
                        <input type="password"
                               name="password"
                               value={formData.password}
                               onChange={handleChange}
                               placeholder="Enter password"/>
                    </label>


                    <label>
                        <input type="password"
                               name="rePassword"
                               value={formData.rePassword}
                               onChange={handleChange}
                               placeholder="Repeat password: "/>
                    </label>
                    <button type="submit" id="addCustomer">Create Account</button>
                </form>
                {inputMessage && <p>{inputMessage}</p>}
            </main>
        </>
    ); 

}
export default CreateCustomer;