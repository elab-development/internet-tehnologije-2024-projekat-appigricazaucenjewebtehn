import React from "react"
import './Login.css'
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';


import user_icon from '../components/assets/person.png'
import email_icon from '../components/assets/email.png'
import password_icon from '../components/assets/password.png'


const LOGIN_URL = "/login";
export default function Login(){
    const { setAuth } = useContext(AuthContext);

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
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('api/login', JSON.stringify({email, pwd}), {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({email, pwd, roles, accessToken});
            setUser('');
            setPwd('');
            setEmail('');
            setSuccess(true);
        }catch(err){
            if(!err?.response){
                setErrMsg('No server response');
            }else if(err.response?.status === 400){
                setErrMsg('Missing username or password');
            }else if(err.response?.status === 401){
                setErrMsg('Unauthorized');
            }else{
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }

        
    }

    const [action, setAction] = useState("Login");
    const navigate = useNavigate();

    const handleActionChange = (newAction) => {
        setAction(newAction);
        navigate(`/${newAction.toLowerCase()}`);
    };

    return(
        <>
        {success ? (
            <div className="logged-header">
                <h1>Ulogovani ste!</h1>
                <br />
                <p>Vrati se na pocetnu stranu</p>
            </div>
        ) : (
            <div className="container" onSubmit={handleSubmit}>
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <form className="inputs">
                    <div>
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email" ref={userRef} onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                    </div>
                    <div>
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder="Password" onChange={(e)=>setPwd(e.target.value)} value={pwd} required/>
                    </div>
                
                    <button>Login</button>
                    <p>Don't have an account? <a href="#">Register here!</a></p>

                </form>
                <div className="error">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                </div>
            </div>  
        )}
        </>
    )
}