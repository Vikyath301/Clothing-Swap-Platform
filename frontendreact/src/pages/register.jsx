    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";
    import "../css/register.css"

    function Register(){

        const navigate = useNavigate();

        const [name,setName]=useState("");
        const [email,setEmail]=useState("");
        const [password,setPassword]=useState("");
        const [location,setLocation]=useState("");

        const registerUser=async(e)=>{

            e.preventDefault();

            try{

                const res=await axios.post("http://localhost:5000/register",{

                    name,
                    email,
                    password,
                    location

                });

                alert(res.data.message);

                setName("");
                setEmail("");
                setPassword("");
                setLocation("");

                navigate("/login");

            }

            catch(err){

                alert(err.response.data.message);

            }

        }

        return(

            <div className="container">

                <h1>Register</h1>

                <form onSubmit={registerUser}>

                    <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                    />

                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    />

                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    />

                    <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                    required
                    />

                    <button>
                        Register
                    </button>

                </form>

            </div>

        )

    }

    export default Register;