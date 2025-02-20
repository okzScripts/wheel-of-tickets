import { BrowserRouter, NavLink, useFetcher, useNavigate, useLocation, useParams } from "react-router";
import "./adminViewStyle.css";
import { createContext, useEffect, useState, use } from "react";

const adminInfoContext = createContext({});
const navigateContext = createContext({})

export function AdminView() {
    //
    const navigate = useNavigate();
    const [companyId, setCompanyId] = useState(1);


    useEffect(() => { setCompanyId(1) }, []);



    return <navigateContext.Provider value={navigate}>
        <adminInfoContext.Provider value={companyId} >
            <main>
                <ProductList />
                <SupportList />
            </main>
        </adminInfoContext.Provider>
    </navigateContext.Provider>
}



function ProductList() {

    const [products, setProducts] = useState([]);
    const companyId = use(adminInfoContext);
    const navigate = use(navigateContext);





    useEffect(() => {

        fetch(`/api/products/company/${companyId}`).then(response =>
            response.json())
            .then(data => setProducts(data));
    }, []);



    return <>
        <h1 className="admin-section-header">Products</h1>
        <div className="product-list-container">
            <ul className="product-list">
                {products.map(ProductCard)}
            </ul>
            <NavLink to={"/product/" + companyId + "/add"}><button className="add-product">Add product</button> </NavLink>
        </div>
    </>


    function ProductCard(product) {
        return <li className="product-list-item" key={product.id}>
            <div>
                <p>{product.name}</p>
            </div>
            <div className="edit-product" >
                <NavLink to={"/product/" + product.id + "/edit"}>
                    <button >edit</button>
                </NavLink>
            </div>
            <div className="delete-button-div-li">
                <button>Delete</button>
            </div>
        </li>

    }

}



function SupportList() {

    const [supports, setSupports] = useState([]);

    const companyId = use(adminInfoContext);


    function BlockSupportById(id, active) {
        fetch(`/api/users/block/${id}/${active}`, {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(id, active),
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
                {supports.map(AgentCard

                )}

            </ul>
            <NavLink to={`/agents/${companyId}/add`}><button className="add-support">Add Support Agent</button></NavLink>
        </div>
    </>
    function AgentCard(support) {

        return <li className="support-list-item" key={support.id}>
            <div>
                <p>{support.name}</p>
                <p>Email: {support.email}</p>
            </div>
            <div className="delete-button-div-li">
                <NavLink to={`/agents/${support.id}/edit`}><button>Edit</button></NavLink>
            </div>
            <div className="block-button-div-li">
                <button className="block-button" onClick={() => BlockSupportById(support.id, support.active)}>{support.active ? "block" : "un-block"}</button>
            </div>

        </li>
    }
}


export function AdminAddProductView() {

    const { id } = useParams();



    function PostProduct(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = id;
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
                <input type="submit" value="Save"></input>
            </form>
            <NavLink to={"/admin"}><button className="add-admin-button">Back</button></NavLink>
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


    });

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
            <form className="productform" onSubmit={updateProduct} action={`/api/products`} method="PUT">
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
                <input type="submit" value="Save"></input>
            </form>
            <NavLink to="/admin">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );

}
export function AdminEditSupportView() {
    const { id } = useParams();
    const [agent, setAgent] = useState({});


    useEffect(() => {

        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => setAgent(data));

    }
    );

    function updateUser(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = agent.company;
        dataObject.role = agent.role;
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
            <form className="supportform" onSubmit={updateUser} action={`/api/users/${agent?.id}`} method="PUT">
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

                <label>
                    Password:
                    <input
                        name="password"
                        defaultValue={agent?.password}
                        type="password"
                        required
                    />
                </label>
                <input type="submit" value="Save"></input>
            </form>
            <NavLink to="/admin">
                <button className="add-admin-button">Back</button>
            </NavLink>
        </main>
    );
}

export function AdminAddSupportView() {
    const { companyID } = useParams();

    function postUser(e) {
        e.preventDefault();
        const form = e.target;

        let formData = new FormData(form);
        let dataObject = Object.fromEntries(formData);
        dataObject.company = companyID;
        dataObject.role = 2;


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
            <form className="adminform" onSubmit={postUser} action="/api/users" method="POST">
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


                <input type="submit" value="Save"></input>
            </form>
            <NavLink to={"/admin"}><button className="add-admin-button">Back</button></NavLink>
        </main>
    );
}
