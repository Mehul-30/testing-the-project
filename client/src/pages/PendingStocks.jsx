import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {

getPendingStocks,

importStocks

}

from "../services/managerApi";

function PendingStocks(){

const[pending,setPending]=useState([]);

useEffect(()=>{

load();

},[]);

const load=async()=>{

const res=await getPendingStocks();

setPending(res.data);

}

const submit=async()=>{

await importStocks();

alert("Imported Successfully");

load();

}

return(

<>

<Navbar/>

<div className="page">

<h2>

Pending Stocks

</h2>

<table>

<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Quantity</th>

</tr>

</thead>

<tbody>

{

pending.map(item=>(

<tr key={item.stock_id}>

<td>

{item.stock_id}

</td>

<td>

{item.stock_name}

</td>

<td>

{item.quantity}

</td>

</tr>

))

}

</tbody>

</table>

<br/>

<button

onClick={submit}

>

Import To Main Stock

</button>

</div>

</>

)

}

export default PendingStocks;