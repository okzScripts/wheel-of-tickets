import { BrowserRouter, NavLink, useFetcher, useNavigate,useLocation } from "react-router";
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
    const navigate= use(navigateContext); 

    function handleAddProduct() {
        navigate("/admin-add-product", { state: { company: companyId } }); 
    }
    
    function handelEditProduct(productId){
        fetch(`api/product/${productId}`)
        .then(response => response.json())
            .then(data => {
                navigate("/admin-edit-Product", { state: { product: data ,id:productId} }); 
            });

    }



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
                      <li className="product-list-item" key={product.id}><div><p>{product.name}</p></div><div className="edit-product" ><button onClick={()=>handelEditProduct(product.id) }>edit</button> </div><div className="delete-button-div-li"><button>Delete</button></div></li>
                )}
            </ul>
            <button className="add-product" onClick={handleAddProduct}>Add product</button>
        </div>
    </> 
}



function SupportList(){
    
    const [supports,setSupports]=useState([]); 

    const companyId = use(adminInfoContext);
    const navigate=use(navigateContext); 
 
    function handleAddProduct() {
        navigate("/admin-add-support", { state: { company: companyId } }); 
    }
    
    function handleEditSupport(email) {
        fetch(`/api/users/2/${email}`)
            .then(response => response.json())
            .then(data => {
                navigate("/admin-edit-Support", { state: { user: data } }); 
            });
    }
    function BlockSupportById(email, active) {
        fetch(`/api/users/block/${email}/${active}`, {
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
            <button className="add-support" onClick={handleAddProduct}>Add Support Agent</button>
        </div>
</>
}


export function AdminAddProductView() {
     const location = useLocation();
    const company = location.state?.company;
   
   
   
    function PostProduct(e)
    {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = company; 
        let dataJson = JSON.stringify(dataObject);
        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: dataJson
        }).then(response => {
        if (response.ok) {
            alert(`Du lade till ${dataObject.name}'s information 🎉`);
        } else {
            alert("Något gick fel ❌");
        }
    })
    }

    return (
        <main>
            <form className="productform" onSubmit={PostProduct} action={`/api/products`} method="POST">
            <label>
                    Name:
                    <input 
                        name="name"
                        type="text"
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
                   Price:
                    <input 
                        name="price"
                        type="integer" 
                        required 
                    />
                </label>
                <label>
                   Category:
                    <input 
                        name="category"
                        type="text" 
                        required 
                    />
                </label>
                <button type="submit">Save</button>
            </form>
            <NavLink to={"/admin"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////
export function AdminEditProductView() {
    const location = useLocation();
    const product = location.state?.product;
    const productId=location.state?.id; 

  

    //admin info
    const [name, setName] = useState("");
    const [previousName, setPreviousName] = useState("");
    const [description, setDescription] = useState("");
    const [price,setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [company,setCompany]= useState(0); 

    

    useEffect(() => {
        if (product) {
            setName(product.name || null);
            setDescription(product.description || null);
            setPreviousName(product.name || null);
            setCategory(product.category || null);
            setCompany(product.company || null);
        }
    }, [product]);

    function updateProduct(e)
    {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = company;
        dataObject.id=productId;  
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
            <form className="productform" onSubmit={updateProduct} action={`/api/products`} method="PUT">
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
                    Description:
                    <input 
                        name="description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="text" 
                        required 
                    />
                </label>

                <label>
                   Price:
                    <input 
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="integer" 
                        required 
                    />
                </label>
                <label>
                   Category:
                    <input 
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        type="text" 
                        required 
                    />
                </label>
                <button type="submit">Save</button>
            </form>
            <NavLink to="/admin">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );

}
export function AdminEditSupportView(){
  const location = useLocation();
    const user = location.state?.user;
   

    //user info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [previousEmail, setPreviousEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");

  

    useEffect(() => {
        if (user) {
            setName(user.name || null);
            setEmail(user.email || null);
            setPreviousEmail(user.email || null);
            setPassword(user.password || null);
            setCompany(user.company || null);
        }
    }, [user]);

    function updateUser(e)
    {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company=company
        dataObject.role = 2;
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
            <form className="supportform" onSubmit={updateUser} action={`/api/users/2/${previousEmail}`} method="PUT">
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
                <button type="submit">Save</button>
            </form>
            <NavLink to="/admin">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}

export function AdminAddSupportView(){
    const location = useLocation();
    const company = location.state?.company;
    function postUser(e) {
        e.preventDefault();
        const form = e.target;
    
        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company=company; 
        dataObject.role = 2;
       
    
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
    
                    
                    <button type="submit">Save</button>
                </form>
                <NavLink to={"/admin"}><button className="add-admin-button">Back</button></NavLink>
            </main>
        );
    }
