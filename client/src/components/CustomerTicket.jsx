import { useEffect, useState } from "react";

export default function CustomerTicket() {

    const [companyPick, setCompanyPick] = useState("");
    const [productPick, setProductPick] = useState("");
    const [categoryPick, setCategoryPick] = useState("");
    const [message, setMessage] = useState("");

    const [inputmessage, setInputMessage] = useState("");
    
    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        fetch("/api/CompanyName")
            .then((response) => response.json())
            .then((data) => setCompanies(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
        if(companyPick){
            fetch(`/api/products/${companyPick}`)
                .then((response) => response.json())
                .then((data) => setProducts(data))
                .catch((error) => console.error("Error fetching products:", error));
        }
    }, [companyPick]);
      
    useEffect(() => {
        fetch("/api/categories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);
    
    const handleCompanyOnChange = (e) => {
        setCompanyPick(e.target.value);
    }  
       
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            companyId: companyPick,
            productId: productPick,
            categoryId: categoryPick,
            message: message,
        };

        try {
            const response = await fetch("/api/customerTicket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }
            setInputMessage("Ticket created successfully!");
        } catch (error) {
            setInputMessage("Error creating ticket: " + error.message);
        }
    };

    return (
        <>
            <header>Logga</header>
            <main>
                <div>
                    <form onSubmit={handleOnSubmit}>
                        <h4>Select Company</h4>
                        <select
                            name="company"
                            value={companyPick}
                            onChange={(e) => setCompanyPick(e.target.value)}>
                            <option value=""> Select Company </option> 
                            {companies.map((company) => (
                                <option className="companies" key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>

                        <h4>Select Product</h4>
                        <select
                            name="product"
                            disabled={!companyPick}
                            value={productPick}
                            onChange={(e) => setProductPick(e.target.value)}>
                            <option value=""> Select Product </option>
                            {products.map((product) => (
                                <option className="products" key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <h4>Select Ticket Category</h4>
                        <select
                            name="category"
                            disabled={!productPick}
                            value={categoryPick}
                            onChange={(e) => setCategoryPick(Number(e.target.value))}>
                            <option value=""> Select Category </option>
                            {categories.map((category) => (
                                <option className="categories" key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>

                        <div id="messageContainer">
                            <p>Message</p>
                            <textarea
                                name="postTicket"
                                rows={10}
                                cols={25}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <button type="submit" id="addTicket">
                            Create Ticket
                        </button>
                    </form>                    
                </div>
                {inputmessage && <p>{inputmessage}</p>}
            </main>
        </>
    );
}
