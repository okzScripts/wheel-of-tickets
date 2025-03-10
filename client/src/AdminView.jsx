import { BrowserRouter, NavLink, useFetcher, useNavigate, useLocation, useParams } from "react-router";
import "./adminViewStyle.css";
import { createContext, useEffect, useState, use } from "react";
import logo from './assets/logo.png';

export function AdminView() {

    return <main className="option-main">
        <div className="big-button-container">
            <NavLink to="/products"><button className="big-button">Products</button></NavLink>
            <NavLink to="/agents"><button className="big-button">Support Agents</button></NavLink>
            <NavLink to="/categories"><button className="big-button">Categories</button></NavLink>
        </div>
    </main>

}



export function ProductView() {

    const [products, setProducts] = useState([]);

    function BlockProductById(id, active) {
        fetch(`/api/products/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ id, active }),
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
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([{}]);
    const [disabled, setDisabled] = useState(false);

    // Fetch categories assigned to this user
    useEffect(() => {
        fetch(`/api/categories/${id}`)
            .then((res) => res.json())
            .then(setSelectedCategories)
            .catch((err) => console.error("Error fetching categories:", err));
    }, [id]);

    // Fetch all available categories
    useEffect(() => {
        fetch(`/api/tickets/categories?companyId=1337`)
            .then((res) => res.json())
            .then(setCategories)
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Fetch user details
    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then((res) => res.json())
            .then(setAgent)
            .catch((err) => console.error("Error fetching user:", err));
    }, [id]);

    // Toggle category selection
    function handleCategoryToggle(categoryId) {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Uncheck
                : [...prev, categoryId] // Check
        );
    }


    function ResetPassword(e) {

        e.preventDefault();
        setDisabled(true);
        setTimeout(() => {
            setDisabled(false);
        }, 2000)

        e.preventDefault();
        fetch("/api/users/password/" + id, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({})
        })
            .then(response => {
                if (response.ok) {
                    alert("Password has been reset")
                } else {
                    alert("An error occured when reseting the password.")
                }
            }
            )
    }

    // Update user data, including selected categories
    function updateUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let dataObject = Object.fromEntries(formData.entries());

        // Convert selectedCategories into { id: true/false }
        let categoriesObject = {};
        categories.forEach((category) => {
            categoriesObject[category.id] = selectedCategories.includes(category.id);
        });

        dataObject.categories = categoriesObject; // Attach formatted categories
        console.log(JSON.stringify(dataObject));
        fetch(e.target.action, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObject),
        })
            .then((res) => {
                if (res.ok) alert(`Updated ${dataObject.name}`);
                else alert("Something went wrong");
            })
            .catch((err) => console.error("Update failed", err));
    }

    return (
        <main>
            <nav className="navbar">
                <img src={logo} alt="logo" />
                <NavLink to="/agents">
                    <button className="back-button">⬅️ Back</button>
                </NavLink>
            </nav>
            <form
                className="data-form"
                onSubmit={updateUser}
                action={`/api/users/agent/${agent.id}`}
                method="PUT"
            >
                <div className="form-box">
                    <label>
                        Name:
                        <input name="name" defaultValue={agent?.name} type="text" required />
                    </label>
                    <label>
                        Email:
                        <input name="email" defaultValue={agent?.email} type="email" required />
                    </label>
                    <label>
                        Categories:
                        <ul className="category-list">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <input
                                        type="checkbox"
                                        id={category.id} name={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                    />
                                    <label htmlFor={category.id}>{category.category_name}</label>
                                </li>
                            ))}
                        </ul>
                    </label>
                </div>
                <input type="submit" value="Save" className="middle-button"></input>     <button disabled={disabled} className="middle-button reset-button" onClick={ResetPassword} >Reset Password</button>
            </form>

        </main>
    );
}



///////////////ADD ADMIN/////////////



export function AdminAddSupportView() {
    const [categories, setCategories] = useState([]);
    const selectedCategories = []

    useEffect(() => {

        fetch(`/api/tickets/categories?companyId=1337`)
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    function postUser(e) {
        e.preventDefault();
        const form = e.target;
        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.selectedCategories = selectedCategories;
        dataObject.role = "service_agent";
        let dataJson = JSON.stringify(dataObject);
        console.log(dataJson)
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

    function HandleCategories(categoryId) {
        const index = selectedCategories.indexOf(categoryId);
        if (index !== -1) {
            selectedCategories.splice(index, 1);
            console.log(selectedCategories)
        } else {
            selectedCategories.push(categoryId);
            console.log(selectedCategories)
        }

    }

    return (
        <main>
            <nav className="navbar"><img src={logo}></img> <NavLink to="/agents"><button className="back-button">⬅️ Back</button></NavLink></nav>
            <form className="data-form" onSubmit={postUser} action="/api/users/agent" method="POST">
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
                    <label>
                        Categories:
                        <ul className="category-list">
                            {categories.map(CategoryCard)}
                        </ul>

                    </label>
                </div>
                <input type="submit" value="Save" className="middle-button"></input>
            </form>
        </main>


    );
    function CategoryCard(category) {
        return <li key={category.id}><input onChange={() => HandleCategories(category.id)} id={category.id} type="checkbox" />
            <label htmlFor={category.id}>{category.category_name} </label>
        </li>
    }
}

export function AdminCategoryView() {

    const [activeCategories, setActiveCategories] = useState([]);
    const [inactiveCategories, setInactiveCategories] = useState([]);

    function fetchActiveCategories() {
        fetch(`/api/categories/company/?active=true`)
            .then(response => response.json())
            .then(data => setActiveCategories(data))
            .catch(error => console.error("Ånej inte ett error!", error));
    }
        
    function fetchInactiveCategories() {
        fetch(`/api/categories/company/?active=false`)
            .then(response => response.json())
            .then(data => setInactiveCategories(data))
            .catch(error => console.error("Ånej inte ett error!", error));
    }

    function AddCategory(e) {
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
                alert(`Du lade till en kategori`);
            } else {
                alert("Något gick fel ");
            }
        });
    }

    useEffect(fetchActiveCategories,[]); 
    useEffect(fetchInactiveCategories,[]);

    return <main>
        <h1>Category Page!</h1>
        <h2>Active categories</h2>
        <div>
        <ul> 
         {activeCategories.map(CategoryCard2)}   
        </ul>
        <h2>Inactive categories </h2>
        <ul> 
            {inactiveCategories.map(CategoryCard2)}
        </ul>
        </div>
        <div>
            <form onSubmit={AddCategory} action={"/api/categories"} method={"POST"}>
            <input name="categoryName" type="text" placeholder="Category Name.."/>
                <input type="submit" value={"Add Category"}/>
            </form>
        </div>
    </main>

    function CategoryCard2(category) {

        return <li key={category.id}>Name: {category.category_name}<button  className="small-button" value={category.active? "Delete":"Activate" } onClick={(e) => HandleCategoryStatus(e,category) }></button></li>


    }

    function HandleCategoryStatus(e,category) {
        e.preventDefault();
        fetch(`/api/categories/status/`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify({id:category.id,active:category.active}) 
    }).then(response => {
                if (response.ok) {
                    alert(`Du lade till   `);
                } else {
                    alert("Något gick fel "); }

            }
        )
        fetchActiveCategories();
        fetchInactiveCategories();
    }
}
