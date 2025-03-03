import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import logo from '../assets/logo.png';
import "../styles.css"
export default function CustomerTicketView() {

    const [companyPick, setCompanyPick] = useState("");
    const [productPick, setProductPick] = useState("");
    const [categoryPick, setCategoryPick] = useState("");
    const [message, setMessage] = useState("");

    
    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if(companyPick){
            fetch(`/api/products/company/${companyPick}`)
                .then((response) => response.json())
                .then((data) => setProducts(data))
                .catch((error) => console.error("Error fetching products:", error));
        }
    }, [companyPick]);
      
    useEffect(() => {
        fetch("/api/tickets/categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

       
    function handleOnSubmit(e) {
        e.preventDefault();
        const formData = {
            companyId: companyPick,
            productId: productPick,
            categoryId: categoryPick,
            message: message,
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
            {/* <nav className="navbar"><img src={logo} alt="Logo" className="navbar-logo" /></nav> */}
            <main className="ticket-main">
                <div className="ticket-form-container">
                    <form className="ticket-form" onSubmit={handleOnSubmit}>
                        {/* <h4 className="ticket-selection-tag">Select Company</h4> */}
                        {/* <select
                            name="company"
                            value={companyPick}
                            onChange={(e) => setCompanyPick(e.target.value)}
                            className="ticket-company-select">
                            <option value="">Select Company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id} className="ticket-company-option">
                                    {company.name}
                                </option>
                            ))}
                        </select> */}

                        <h4 className="ticket-selection-tag">Select Product</h4>
                        <select
                            name="product"
                            disabled={!companyPick}
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

                        <div className="ticket-message-container">
                            <p className="ticket-message-label">Message</p>
                            <textarea
                                name="postTicket"
                                rows={10}
                                cols={25}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="ticket-message-textarea"
                            />
                        </div>

                        <input type="submit" className="ticket-submit-button" value='Create Ticket' />
                    </form>
                </div>
            </main>
        </>

    );
}
