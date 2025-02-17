import React, {useState} from "react";

const CreateCustomer = () => 
{
    const [formData, setFormData] = useState({
        name:"",        
        email:"",
        password:"",
        rePassword:""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({ ...prevData, [name]:value}));
    };



    const handleOnSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.rePassword) {
            setMessage("Passwords do not match");
            return;
        }
        
        try {

            const response = await fetch("/api/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok){
                throw new Error("User not created");
            }
            
            setMessage("User created successfully");
        } catch (error){
            setMessage(error.message)
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
                        <input type="text"
                               name="email"
                               value={formData.email}
                               onChange={handleChange}
                               placeholder="Enter email:"/>
                    </label>

                    <label>
                        <input type="text" //ändra senare till type password.
                               name="password"
                               value={formData.password}
                               onChange={handleChange}
                               placeholder="Enter password"/>
                    </label>


                    <label>
                        <input type="text" //ändra senare till type password.
                               name="rePassword"
                               value={formData.rePassword}
                               onChange={handleChange}
                               placeholder="Repeat password: "/>
                    </label>
                    <button type="submit" id="addCustomer">Create Account</button>
                </form>
                {message && <p>{message}</p>}
            </main>
        </>
    ); 

}
export default CreateCustomer;