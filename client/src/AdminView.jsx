import { BrowserRouter, NavLink, useFetcher, useNavigate, useLocation, useParams } from "react-router";
import "./adminViewStyle.css";
import { createContext, useEffect, useState, use } from "react";
import logo from './assets/logo.png';

export function AdminView() {
 
    return <main className="option-main">
        <div className="big-button-container">
            <NavLink to="/products"><button className="big-button">Products</button></NavLink>
            <NavLink to="/agents"><button className="big-button">Support Agents</button></NavLink>
        </div>
    </main>
    
}



export function ProductView() {

    const [products, setProducts] = useState([]);

    function BlockProductById(id, active) {
        fetch(`/api/products/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({id, active}),
        })
            .then(response => {
                if (response.ok) { console.log("Det Funkade Igen") }
                fetchProducts();
            })

    };

    function fetchProducts() {
        fetch(`/api/products/company`)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }

    // Hämta produkter vid första rendering
    useEffect(fetchProducts, []);



    return <main>
        <nav className="navbar"><img src={logo}></img> <NavLink to="/admin"><button className="back-button">⬅️ Back</button></NavLink></nav>
        <section className="header-section"><h1>All Products</h1></section>
        <ul className="list">
            {products.map(ProductCard)}
        </ul>
        <section className="content-box">
            <NavLink to={`/product/add`}><button className="middle-button">Add product</button> </NavLink>
        </section>
    </main>


    function ProductCard(product) {
        return <li className="list-item" key={product.id}>
            <div className="card-info">
                <p><strong>Name:</strong><br />{product.name}</p><br />
                <p><strong>Price:</strong><br />{product.price}</p><br />
                <p><strong>Category:</strong><br />{product.category}</p><br />
            </div>
            <div className="card-buttons">
                <NavLink to={"/product/" + product.id + "/edit"}><button>Edit</button></NavLink>
                <button className="small-button" onClick={() => BlockProductById(product.id, product.active)}>{product.active ? "block" : "un-block"}</button>
            </div>
        </li>
    }

}



export function SupportView() {

    const [supports, setSupports] = useState([]);
    const agent = "Service_agent"

    function fetchUsers() {
        fetch(`/api/users/company/${agent}`)
            .then(response => response.json())
            .then(data => setSupports(data))
            .catch(error => console.error("Error fetching users:", error));
    }

    function BlockSupportById(id, active) {
        fetch(`/api/users/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ id, active }),
        })
            .then(response => {
                if (response.ok) {
                    console.log("User status updated");
                    fetchUsers();
                }
            })
            .catch(error => console.error("Error updating user:", error));
    }

    useEffect(
        fetchUsers
        , []);
    return <main>
        <nav className="navbar"><img src={logo}></img> <NavLink to="/admin"><button className="back-button">⬅️ Back</button></NavLink></nav>
        <section className="header-section"><h1>All Service Agents</h1></section>
        <ul className="list">
            {supports.map(AgentCard)}
        </ul>
        <section className="content-box">
            <NavLink to={`/agents/add`}><button className="middle-button">Add Support Agent</button></NavLink>
        </section>
    </main>
    function AgentCard(support) {

        return <li className="list-item" key={support.id}>
            <div className="card-info">
                <p><strong>Name:</strong><br />{support.name}</p><br />
                <p><strong>Email:</strong><br />{support.email}</p><br />
            </div>
            <div className="card-buttons">
                <NavLink to={`/agents/${support.id}/edit`}><button>Edit</button></NavLink>
                <button className="small-button" onClick={() => BlockSupportById(support.id, support.active)}>{support.active ? "block" : "un-block"}</button>
            </div>
        </li>
    }
}


export function AdminAddProductView() {

    const { companyId } = useParams();

    function PostProduct(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = companyId;
        let dataJson = JSON.stringify(dataObject);
        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du lade till ${dataObject.name} `);
            } else {
                alert("Något gick fel ");
            }
        })
    }

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/products"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={PostProduct} action={`/api/products`} method="POST">
                <div className="form-box">
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
                </div>
                <input type="submit" value="Save" className="middle-button"></input>
            </form>
        </main>
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////
export function AdminEditProductView() {

    const { id } = useParams();
    const [product, setProduct] = useState(null);



    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(response => response.json()
                .then(data => setProduct(data)))


    }, []);

    function updateProduct(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = product.company;
        dataObject.id = product.id;
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

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/products"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={updateProduct} action={`/api/products`} method="PUT">
                <div className="form-box">
                    <label>
                        Name:
                        <input
                            name="name"
                            defaultValue={product?.name}
                            type="text"
                            required
                        />
                    </label>

                    <label>
                        Description:
                        <input
                            name="description"
                            defaultValue={product?.description}
                            type="text"
                            required
                        />
                    </label>

                    <label>
                        Price:
                        <input
                            name="price"
                            defaultValue={product?.price}
                            type="number"
                            required
                        />
                    </label>
                    <label>
                        Category:
                        <input
                            name="category"
                            defaultValue={product?.category}
                            type="text"
                            required
                        />
                    </label>
                </div>
                <input type="submit" value="Save" className="middle-button"></input>
            </form>
        </main>
    );

}
export function AdminEditSupportView() {
    const { id } = useParams();
    const [agent, setAgent] = useState({});


    useEffect(() => {

        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => {setAgent(data)})
            .then(()=> console.log(agent.role));
            
            

    },[]);

   function ResetPassword(e){
    e.preventDefault(); 
    fetch("PUT","/api/users/password/"+id)
    .then(response=> {
        if(response.ok){
            alert("Password has been reset")
        }else{
            alert("An error occured when reseting the password.")    
        }
        }
    ) 
   }

    function updateUser(e) {
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
                alert(`Du updaterade ${dataObject.name} `);
            } else {
                alert("Något gick fel ");
            }
        })
    }

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/agents"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={updateUser} action={`/api/users/${agent?.id}`} method="PUT">
                <div className="form-box">
                    <label>
                        Name:
                        <input
                            name="name"
                            defaultValue={agent?.name}
                            type="text"
                            required
                        />
                    </label>

                    <label>
                        Email:
                        <input
                            name="email"
                            defaultValue={agent?.email}
                            type="email"
                            required
                        />
                    </label>
                </div>
                <input type="submit" value="Save" className="middle-button"></input>       <button className="middle-button" onClick={ResetPassword} >Reset Password</button>
            </form>

        </main>
    );
}

export function AdminAddSupportView() {
   

    function postUser(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = null;
        dataObject.role = "service_agent"; 


        let dataJson = JSON.stringify(dataObject);

        fetch(form.action, {
            headers: { "Content-Type": "application/json" },
            method: form.method,
            body: dataJson
        }).then(response => {
            if (response.ok) {
                alert(`Du lade till ${dataObject.name}  `);
            } else {
                alert("Något gick fel ");
            }
        });
    }

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/agents"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={postUser} action="/api/users" method="POST">
                <div className="form-box">
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

                </div>
                <input type="submit" value="Save" className="middle-button"></input>
            </form>
        </main>
    );
}
