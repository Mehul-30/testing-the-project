import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getPurchaseHistory } from "../services/retailApi";

function PurchaseHistory() {

    const [history, setHistory] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const res = await getPurchaseHistory(user.id);

            setHistory(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <>

            <Navbar/>

            <div className="page">

                <h2>

                    Purchase History

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>Stock</th>

                            <th>Quantity</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.map((item)=>(

                                <tr key={item.retail_id}>

                                    <td>

                                        {item.stock_name}

                                    </td>

                                    <td>

                                        {item.quantity}

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                item.purchased_at

                                            ).toLocaleString()

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default PurchaseHistory;