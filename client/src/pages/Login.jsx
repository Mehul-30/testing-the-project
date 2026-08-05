import {

useState

}

from "react";

import {

Link,

useNavigate

}

from "react-router-dom";

import {

login

}

from "../services/userApi";

function Login(){

const navigate=useNavigate();

const[username,setUsername]=useState("");

const[password,setPassword]=useState("");

const submit=async()=>{

try{

const res=await login({

username,

password

});

localStorage.setItem(

"token",

res.data.token

);

localStorage.setItem(

"user",

JSON.stringify(res.data.user)

);

if(res.data.user.role==="manager"){

navigate("/manager");

}

else{

navigate("/user");

}

}

catch(err){

alert(err.response.data.message);

}

}

return(

<div className="container">

<h2>

Login

</h2>

<input

placeholder="Username"

value={username}

onChange={(e)=>setUsername(e.target.value)}

/>

<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<button

onClick={submit}

>

Login

</button>

<br/>

<br/>

<Link to="/register">

Create Account

</Link>

</div>

)

}

export default Login;