import { BrowserRouter, NavLink, useFetcher, useNavigate } from "react-router";
import "./adminViewStyle.css";
import { createContext, useEffect, useState ,use} from "react";

const adminInfoContext=  createContext({}); 
const navigateContext =createContext({})

export function AdminView(){
    //
    const navigate = useNavigate();
    const [companyId,setCompanyId]=useState(1);
    
 
    useEffect(()=> { setCompanyId(1)} ,[]); 
    

 
    return <navigateContext.Provider value={navigate}>
        <adminInfoContext.Provider value={companyId} >
       <main> 
            <ProductList/> 
            <SupportList/> 
       </main>
    </adminInfoContext.Provider>
    </navigateContext.Provider>
}



function ProductList(){

    const [products,setProducts]=useState([]); 
    const companyId = use(adminInfoContext);


    
    useEffect(() => {
        
        fetch(`/api/products/${companyId}`).then(response =>
            response.json())
            .then(data => setProducts(data));
    }, []);



    return<>
    <h1 className="admin-section-header">Products</h1>
        <div className="product-list-container">
            <ul className="product-list"> 
                {products.map( product =>
                      <li className="product-list-item" key={product.id}><div><p>{product.productName}</p></div><div className="delete-button-div-li"><button>Delete</button></div></li>
                )}
            </ul>
            <NavLink to="/admin-add-product"><button className="add-product">Add product</button></NavLink>
        </div>
    </> 
}



function SupportList(){
    
    const [supports,setSupports]=useState([]); 

    const companyId = use(adminInfoContext);
    const navigate=use(navigateContext); 
 
    function handleEditSupport(email) {
        fetch(`/api/users/2/${email}`)
            .then(response => response.json())
            .then(data => {
                navigate("/admin-edit-Support", { state: { admin: data } }); 
            });
    }
    function BlockSupportById(email, active) {
        fetch(`/api/users/${email}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(email, active),
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen") }
            })
    }

    useEffect(() => {
        
        fetch(`/api/users/company/2/${companyId}`).then(response =>
            response.json())
            .then(data => setSupports(data));
    }, [BlockSupportById]);
return <>
<h1 className="admin-section-header">Support Agents</h1>
        <div className="support-list-container">
            <ul className="support-list">
                {supports.map(support =>
                    <li className="support-list-item" key={support.id}><div><p>{support.name}</p> <p>Email: {support.email}</p></div><div className="delete-button-div-li">
                        <button onClick={() => handleEditSupport(support.email)}>Edit</button><div className="block-button-div-li"><button className="block-button" onClick={() => BlockSupportById(support.email, support.active)}>{support.active ? "block" : "un-block"}</button></div>
                    </div></li>
                )}

            </ul>
        </div>
</>
}




export function AddSupport(){
   
    



    return < > 
    <h1>Add support member</h1>
    <UserForm 
    props={{ name:"",
        email:"", 
        password:"",
        method:"POST",
    }}/>
    
    </>

}






function UserForm(props){ 
    
    let name=props.name; 
    let email=props.email; 
    let password=props.password;
    let method=props.method; 
    let company=use(adminInfoContext); 
    
    function onSubmit(e){
        e.preventDefault();
        const form = e.target;

        let data = new FormData(form);
        data = Object.fromEntries(data);
        data = JSON.stringify(data);

        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: data
        })
        
    }
    return <>
    <form className="userform" onSubmit={onSubmit} action={`/api/users/3/${email}`} method={`${method}`}  >
                <label>
                    Name:
                    <input 
                        name="name"
                        value={name} 
                        type="text"
                        required 
                    />
                </label>
                
                <label>
                    Email:
                    <input 
                        name="email" 
                        value={email}
                        type="email" 
                        required 
                    />
                </label>

                <label>
                    Password:
                    <input 
                        name="password"
                        value={password}
                        type="password" 
                        required 
                    />
                </label>


                <button type="submit">Save</button>
            </form>
            <NavLink to="/admin-start-vue">
                <button className="add-admin-button">Back</button>
            </NavLink>
    </>

}

