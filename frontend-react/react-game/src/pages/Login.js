import React from "react"
import './Login.css'
import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import { loginUser, logoutUser } from '../hooks/useSessionStorage';

import email_icon from '../components/assets/email.png'
import password_icon from '../components/assets/password.png'



export default function Login(){
    const { auth, setAuth } = useContext(AuthContext);

    const userRef = useRef(null);
    const errRef = useRef(null);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const isLoggedIn = auth?.token || window.sessionStorage.getItem('auth_token');

    useEffect(() => {
        if (isLoggedIn) {
            setSuccess(true);
        } else {
            userRef.current?.focus();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        try{
            console.log('Login attempt:', { email, pwd });
            const response = await axios.post(
                '/api/login',
                { email, password: pwd },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Login successful:', response.data);
            const { token, user } = response.data;

            if (!token) {
                throw new Error('No token received');
            }

            const userDataForStorage = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            console.log('Final user data for storage:', userDataForStorage);

            loginUser(token, userDataForStorage);

            if (setAuth) {
                setAuth({ user: userDataForStorage, token });
            }

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

    const handleLogout = () => {
        logoutUser();
        
        if (setAuth) {
            setAuth({});
        }
        
        setSuccess(false);
        setEmail('');
        setPwd('');
        setErrMsg('');
        
        console.log('User logged out successfully');
        
        navigate('/login');
    };

    return(
        <>
        {success || isLoggedIn ? (
            <div className="logged-header">
                <h1>Ulogovani ste!</h1>
                <br />
                <p>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}>Vrati se na pocetnu stranu</a>
                </p>
                <br />
                <button 
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logout
                </button>
            </div>
        ) : (
            <div className="container" onSubmit={handleSubmit}>
                <div className="header">
                    <div className="text">Login</div>
                    <div className="underline"></div>
                </div>
                <form className="inputs">
                    <div>
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email" ref={userRef} autoComplete="off" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                    </div>
                    <div>
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder="Password" onChange={(e)=>setPwd(e.target.value)} value={pwd} required/>
                    </div>
                
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="/register">Register here!</a></p>

                </form>
                <div className="error">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                </div>
            </div>  
        )}
        </>
    )
}