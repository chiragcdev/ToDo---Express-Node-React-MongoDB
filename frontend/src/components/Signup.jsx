import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Signup () {

    const navigate = useNavigate();
    const [userData, setUserData] = useState();

    useEffect(()=>{
        if(localStorage.getItem('login')){
            navigate('/')
        }
    })

    const handleSignup = async () => {
        console.log(userData);
        let result = await fetch("http://localhost:3200/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        result = await result.json(); 
        if (result.success) {
            console.log(result);
            document.cookie= "token=" + result.token; // Store value in cookie
            localStorage.setItem('login',userData.email)
            window.dispatchEvent(new Event('localStorage-change'))
            navigate('/') 
        }
    }

    return (
        <div className="wrapper login-wrapper">
            <div className="wrapper-inner">
                <h1 className="text-center">Sign Up</h1>
                <div className="form">
                    <label htmlFor="name">Name:</label>
                    <input onChange={(event)=>setUserData({...userData, name: event.target.value})} type="text" id="name" name="name" placeholder="Enter Name" />
                    <br />
                    <label htmlFor="email">Email:</label>
                    <input onChange={(event)=>setUserData({...userData, email: event.target.value})} type="text" id="email" name="email" placeholder="Enter Email" />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input onChange={(event)=>setUserData({...userData, password: event.target.value})} type="password" id="password" name="password" placeholder="Enter Password" />
                    <br /><br /> 
                    <button onClick={handleSignup} className="full-width">Sign Up</button>
                    <p className="text-center">Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    )

}