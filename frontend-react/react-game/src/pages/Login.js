import React from "react"
import './Login.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import user_icon from '../components/assets/person.png'
import email_icon from '../components/assets/email.png'
import password_icon from '../components/assets/password.png'



export default function Login(){
    const [action, setAction] = useState("Login");
    const navigate = useNavigate();

    const handleActionChange = (newAction) => {
        setAction(newAction);
        navigate(`/${newAction.toLowerCase()}`);
    };

    return(
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div> : <div>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name" />
                </div>}
                
                <div>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>
                <div>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>
            </div>

            {action === "Register" ? <div></div> : <div className="forgot-password">Forgot password? <span>Click here!</span></div>}
            
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => handleActionChange("Register")}>Register</div>
                <div className={action === "Register" ? "submit gray" : "submit"} onClick={() => handleActionChange("Login")}>Login</div>
            </div>
        </div>
    )
}