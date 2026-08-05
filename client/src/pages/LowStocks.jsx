import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getLowStocks }

from "../services/managerApi";

function LowStocks(){

const[data,setData]=useState([]);

useEffect(()=>{

load();

},[]);

const load=async()=>{

const res=await getLowStocks();

setData(res.data);

}

return(

<>

<Navbar/>

<div className="page">

<h2>

Low Stock Products

</h2>

<table>

<thead>

<tr>

<th>Name</th>

<th>Category</th>

<th>Remaining</th>

</tr>

</thead>

<tbody>

{

data.map(stock=>(

<tr key={stock.alert_id}>

<td>

{stock.stock_name}

</td>

<td>

{stock.category_name}

</td>

<td>

{stock.current_quantity}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</>

)

}

export default LowStocks;