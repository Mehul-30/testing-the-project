import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllStocks } from "../services/stockApi";
import { buyStock } from "../services/retailApi";

function BuyStock() {

    const [stocks, setStocks] = useState([]);
    const [selected, setSelected] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {

        try {

            const res = await getAllStocks();

            setStocks(res.data);

        } catch (err) {

            console.error(err);

            alert("Unable to load stocks.");

        }

    };

    const handleSelect = (stock) => {

        setSelected(stock);

        setQuantity(1);

    };

    const handleBuy = async () => {

        if (!selected) {

            alert("Please select a stock.");

            return;

        }

        if (quantity <= 0) {

            alert("Enter a valid quantity.");

            return;

        }

        try {

            const res = await buyStock({

                user_id: user.id,

                stock_id: selected.stock_id,

                quantity: Number(quantity)

            });

            alert(res.data.message);

            setSelected(null);

            setQuantity(1);

            loadStocks();

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Purchase Failed");

        }

    };

    return (

        <>
            <Navbar />

            <div className="page">

                <h2>Buy Stocks</h2>

                <div className="stock-grid">

                    {stocks.map((stock) => (

                        <div
                            key={stock.stock_id}
                            className="card"
                        >

                            <h3>{stock.stock_name}</h3>

                            <p>Category: {stock.category_name}</p>

                            <p>Available: {stock.quantity}</p>

                            <button
                                onClick={() => handleSelect(stock)}
                            >
                                Select
                            </button>

                        </div>

                    ))}

                </div>

                {selected && (

                    <div className="buy-box">

                        <h3>{selected.stock_name}</h3>

                        <p>

                            Available Quantity:

                            {selected.quantity}

                        </p>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                        />

                        <button
                            onClick={handleBuy}
                        >
                            Buy Now
                        </button>

                    </div>

                )}

            </div>

        </>

    );

}

export default BuyStock;