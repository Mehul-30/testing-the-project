import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {

getNotifications,

markRead

}

from "../services/notificationApi";

function Notifications(){

const[list,setList]=useState([]);

const user=JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

loadNotifications();

},[]);

const loadNotifications=async()=>{

try{

const res=await getNotifications(user.id);

setList(res.data);

}

catch(err){

console.log(err);

}

}

const read=async(id)=>{

await markRead(id);

loadNotifications();

}

return(

<>

<Navbar/>

<div className="page">

<h2>

Notifications

</h2>

{

list.length===0?

<p>

No Notifications

</p>

:

list.map(notification=>(

<div

key={notification.notification_id}

className={

notification.is_read

?

"notification"

:

"notification unread"

}

>

<h3>

{notification.title}

</h3>

<p>

{notification.message}

</p>

<small>

{

new Date(

notification.created_at

).toLocaleString()

}

</small>

<br/>

{

!notification.is_read&&

<button

onClick={()=>read(notification.notification_id)}

>

Mark As Read

</button>

}

</div>

))

}

</div>

</>

)

}

export default Notifications;