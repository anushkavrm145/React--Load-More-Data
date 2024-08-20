import { useEffect, useState } from "react";
import "./styles.css";

export default function LoadMoreData() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [disableButton, setDisableButton] = useState(false);
    const [totalProductsLoaded, setTotalProductsLoaded] = useState(0);

    async function fetchProducts() {
        try {
            setLoading(true);
            const response = await fetch(`https://dummyjson.com/products?limit=20&skip=${count * 20}`);
            const result = await response.json();

            if (result && result.products) {
                const newProducts = result.products;
                setProducts((prevData) => [...prevData, ...newProducts]);
                setTotalProductsLoaded(prevCount => prevCount + newProducts.length);

                // Check if the total products loaded is 100 or more
                if (totalProductsLoaded + newProducts.length >= 100) {
                    setDisableButton(true);
                }
            }
        } catch (e) {
            console.error('Error fetching products:', e);
            // Optionally, set an error state to display an error message
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [count]);

    return (
        <div className="load-more-container">
            {loading && <div>Loading data... Please wait</div>}
            <div className="product-container">
                {products.length > 0 ? (
                    products.map(item => (
                        <div className="product" key={item.id}>
                            <img src={item.thumbnail} alt={item.title} />
                            <p>{item.title}</p>
                        </div>
                    ))
                ) : (
                    !loading && <p>No products available.</p>
                )}
            </div>
            <div className="button-container">
                <button disabled={disableButton} onClick={() => setCount(count + 1)}>
                    Load more products
                </button>
                {disableButton && <p>You have browsed 100 products</p>}
            </div>
        </div>
    );
}
