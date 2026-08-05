import Navbar from "../components/Navbar";

function UserDashboard(){

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

Buy Stocks

</h3>

<p>

Purchase available products.

</p>

</div>

<div className="card">

<h3>

Purchase History

</h3>

<p>

View previous purchases.

</p>

</div>

<div className="card">

<h3>

Notifications

</h3>

<p>

View stock arrival alerts.

</p>

</div>

</div>

</div>

</>

)

}

export default UserDashboard;