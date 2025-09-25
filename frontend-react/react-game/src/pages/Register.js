import React from "react"
import './Login.css'
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "../api/axios";

import user_icon from '../components/assets/person.png'
import email_icon from '../components/assets/email.png'
import password_icon from '../components/assets/password.png'

//const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register(){
    const userRef = useRef(null);
    const errRef = useRef(null);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [user, setUser] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if(userRef.current){
            userRef.current.focus();
        }
        
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, email, pwd);
        try{
            const response = await axios.post('/api/register', 
                { name: user, email, password: pwd },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                    }
                }
            ).then((response) => {
                setSuccess(true);
                console.log(response.data);
                console.log(JSON.stringify(response));
                navigate('/login');
            });
        }catch(err){
            console.log('Full error:', err);
            console.log('Error response:', err.response?.data);
            if(!err?.response){
                setErrMsg('No server response');
            } else if(err.response?.status){
                setErrMsg('Username taken');
            } else{
                setErrMsg('Registration failed');
            }
            errRef.current.focus();
        }
    }

    const [action, setAction] = useState("Register");
    const navigate = useNavigate();

    const handleActionChange = (newAction) => {
        setAction(newAction);
        navigate(`/${newAction.toLowerCase()}`);
    };

    return(
        <>
        {success ? (
            <div className="logged-header">
                <h1>Uspesna registracija!</h1>
                <br />
                <p>Vrati se na: <a href="/login">Login</a></p>
            </div>
        ) : (
            <div className="container" onSubmit={handleSubmit}>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <form className="inputs">
                <div>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name" value = {user} autoComplete="off" onChange={(e)=>setUser(e.target.value)} required/>
                </div>
                <div>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" ref={userRef} autoComplete="off" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                <div>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" onChange={(e)=>setPwd(e.target.value)} value={pwd} required/>
                </div>

                <button type="submit">Register</button>
            </form>
            
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            </section>
        </div>
        
        )}
        </>
    )
}