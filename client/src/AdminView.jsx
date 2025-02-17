import { BrowserRouter, NavLink, useFetcher } from "react-router";
import "./adminViewStyle.css";
import { createContext, useEffect, useState ,use} from "react";

const adminInfoContext=  createContext({}); 


export function AdminView(){
    //
    const [companyId,setCompanyId]=useState(1);
   

    useEffect(()=> { setCompanyId(1)} ,[]); 
    

 
    return <adminInfoContext.Provider value={companyId} >
       <main> 
            <ProductList/> 
       </main>
    </adminInfoContext.Provider>
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
    <h1>Products</h1>
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




