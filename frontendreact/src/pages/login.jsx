import hero from "../assets/hero.png";
import { useState } from "react";
import axios from "axios";
import "../css/login.css";
import { useNavigate } from "react-router-dom";


function Login() {

    const navigate=useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                `${API}/login`,
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            alert(res.data.message);

            setEmail("");
            setPassword("");

            if (res.data.role === "admin") {
                navigate("/admin");
            }
            else {
                navigate("/home");
            }
            
        }

        catch (err) {

            alert(err.response.data.message);

        }

    };

    return (
       <div className="login-page"style={{backgroundImage: `url(${hero})`}}>
        
        <div className="container">

            <h1>Login</h1>

            <form onSubmit={loginUser}>

                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
        </div>

    );

}

export default Login;