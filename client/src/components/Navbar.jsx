import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="navbar">

            <h2>Inventory Management</h2>

            <div>

                {

                    user.role === "manager"

                    ?

                    <>

                        <Link to="/manager">Dashboard</Link>

                        <Link to="/stocks/add">Add Stock</Link>

                        <Link to="/stocks/pending">Pending</Link>

                        <Link to="/manager/lowstocks">Low Stocks</Link>

                        <Link to="/notifications">Notifications</Link>

                    </>

                    :

                    <>

                        <Link to="/user">Dashboard</Link>

                        <Link to="/buy">Buy</Link>

                        <Link to="/history">History</Link>

                        <Link to="/notifications">Notifications</Link>
                        <Link to="/manager">

                            Dashboard

                            </Link>

                            <Link to="/stocks/add">

                            Add Stock

                            </Link>

                            <Link to="/stocks/pending">

                            Pending

                            </Link>

                            <Link to="/manager/lowstocks">

                            Low Stocks

                            </Link>

                            <Link to="/notifications">

                            Notifications

                            </Link>

                    </>

                }

                <button onClick={logout}>

                    Logout

                </button>

            </div>

        </div>

    );

}

export default Navbar;