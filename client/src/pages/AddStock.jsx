import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getAllStocks } from "../services/stockApi";

import { addStock } from "../services/managerApi";

function AddStock() {

    const [stocks, setStocks] = useState([]);

    const [stockId, setStockId] = useState("");

    const [quantity, setQuantity] = useState("");

    useEffect(() => {

        loadStocks();

    }, []);

    const loadStocks = async () => {

        const res = await getAllStocks();

        setStocks(res.data);

    };

    const submit = async () => {

        try {

            await addStock({

                stock_id: stockId,

                quantity

            });

            alert("Added Successfully");

            setQuantity("");

        }

        catch (err) {

            alert(err.response.data.message);

        }

    };

    return (

        <>

            <Navbar/>

            <div className="page">

                <h2>Add Stock</h2>

                <select

                    value={stockId}

                    onChange={(e)=>setStockId(e.target.value)}

                >

                    <option value="">

                        Select Stock

                    </option>

                    {

                        stocks.map(stock=>(

                            <option

                                key={stock.stock_id}

                                value={stock.stock_id}

                            >

                                {stock.stock_name}

                            </option>

                        ))

                    }

                </select>

                <input

                    type="number"

                    placeholder="Quantity"

                    value={quantity}

                    onChange={(e)=>setQuantity(e.target.value)}

                />

                <button onClick={submit}>

                    Add Stock

                </button>

            </div>

        </>

    );

}

export default AddStock;