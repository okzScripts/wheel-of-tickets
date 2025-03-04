import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import logo from '../assets/logo.png';
import "../styles.css"
export default function CustomerTicketView() {

    
    const [productPick, setProductPick] = useState("");
    const [categoryPick, setCategoryPick] = useState("");
    const [message, setMessage] = useState("");   
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState([]);
    const [companyId, setCompanyId] = useState(null);


    const urlParams = new URLSearchParams(window.location.search);
    const companyIdFromUrl = urlParams.get('companyId');
   
    useEffect(() => {
        if (companyIdFromUrl) {
            setCompanyId(companyIdFromUrl);
            fetch(`/api/products/customer-ticket?companyId=${companyIdFromUrl}`)
                .then((response) => response.json())
                .then((data) => setProducts(data))
                .catch((error) => console.error("Error fetching products:", error));
            // 1. Spara companyId i session (kräver backend-endpoint)
            
        }
    }, []);
    
      
    useEffect(() => {
        
        fetch(`/api/tickets/categories?companyId=${companyIdFromUrl}`)
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

       
    function handleOnSubmit(e) {
        e.preventDefault();
        const formData = {
            productId: productPick,
            categoryId: categoryPick,
            message: message,
            email: email,
        };

        fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }).then(response=>{
                if (response.ok) {
                    alert(`Du lade till en ticket`);
                } else {
                    alert("Något gick fel ");
                }
            })
          
    };

    return (
        <>
            <main className="ticket-main">
                <div className="ticket-form-container">
                    <form className="ticket-form" onSubmit={handleOnSubmit}>
                        <h4 className="ticket-selection-tag">Select Product</h4>
                        <select
                            name="product"
                            disabled={!setEmail}
                            value={productPick}
                            onChange={(e) => setProductPick(e.target.value)}
                            className="ticket-product-select">
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id} className="ticket-product-option">
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <h4 className="ticket-selection-tag">Select Ticket Category</h4>
                        <select
                            name="category"
                            disabled={!productPick}
                            value={categoryPick}
                            onChange={(e) => setCategoryPick(Number(e.target.value))}
                            className="ticket-category-select">
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id} className="ticket-category-option">
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {<h4 className="ticket-selection-tag">Email</h4>}
                        <input
                            disabled={!categoryPick}
                            type="email"
                            name="email"
                            value={email}
                            onChange={e=> setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="ticket-input"
                            
                        />
                        <div className="ticket-message-container">
                            <p className="ticket-message-label">Message</p>
                            <textarea
                                disabled={!categoryPick}
                                name="postTicket"
                                rows={10}
                                cols={25}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="ticket-message-textarea"
                                required
                            />
                        </div>

                        <input disabled={!message} type="submit" className="ticket-submit-button" value='Create Ticket'/>
                    </form>
                </div>
            </main>
        </>

    );
}
