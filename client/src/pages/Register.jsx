import{

useState

}

from "react";

import{

Link,

useNavigate

}

from "react-router-dom";

import{

register

}

from "../services/userApi";

function Register(){

const navigate=useNavigate();

const[full_name,setName]=useState("");

const[username,setUsername]=useState("");

const[password,setPassword]=useState("");

const[role,setRole]=useState("user");

const submit=async()=>{

try{

await register({

full_name,

username,

password,

role

});

alert("Registered");

navigate("/");

}

catch(err){

alert(err.response.data.message);

}

}

return(

<div className="container">

<h2>

Register

</h2>

<input

placeholder="Full Name"

value={full_name}

onChange={(e)=>setName(e.target.value)}

/>

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

<select

value={role}

onChange={(e)=>setRole(e.target.value)}

>

<option value="user">

User

</option>

<option value="manager">

Manager

</option>

</select>

<button

onClick={submit}

>

Register

</button>

<br/>

<br/>

<Link to="/">

Back To Login

</Link>

</div>

)

}

export default Register;