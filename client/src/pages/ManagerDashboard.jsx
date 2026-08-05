import Navbar from "../components/Navbar";

function ManagerDashboard(){

const user=JSON.parse(

localStorage.getItem("user")

);

return(

<>

<Navbar/>

<div className="page">

<h2>

Welcome {user.name}

</h2>

<div className="stock-grid">

<div className="card">

<h3>

Add Stock

</h3>

<p>

Add stock to temporary storage.

</p>

</div>

<div className="card">

<h3>

Pending Stocks

</h3>

<p>

Import pending stocks.

</p>

</div>

<div className="card">

<h3>

Low Stock

</h3>

<p>

Monitor low inventory.

</p>

</div>

<div className="card">

<h3>

Notifications

</h3>

<p>

Manager Alerts.

</p>

</div>

</div>

</div>

</>

)

}

export default ManagerDashboard;