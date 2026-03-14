import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login () {
    const navigate = useNavigate();
    const [userData, setUserData] = useState();

    useEffect(()=>{
        if(localStorage.getItem('login')){
            navigate('/')
        }
    })

    const handleLogin = async () => {
        console.log(userData);
        let result = await fetch("http://localhost:3200/login", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }            
        });
        result = await result.json(); 
        if (result.success) {
            console.log(result);
            document.cookie="token="+result.token;
            localStorage.setItem('login',userData.email)
            window.dispatchEvent(new Event('localStorage-change'))
            navigate('/') 
        } else {
            alert(result.message);
        }
    }

    return (
        <div className="wrapper login-wrapper">
            <div className="wrapper-inner">
                <h1 className="text-center">Login</h1>
                <div className="form">
                    <label htmlFor="email">Email:</label>
                    <input onChange={(event)=>setUserData({...userData, email: event.target.value})} type="text" id="email" name="email" placeholder="Enter Email" />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input onChange={(event)=>setUserData({...userData, password: event.target.value})} type="password" id="password" name="password" placeholder="Enter Password" />
                    <br /><br /> 
                    <button onClick={handleLogin} className="full-width">Login</button>
                    <p className="text-center">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )

}