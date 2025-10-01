import "./Home.css";
import { useState, useEffect } from "react";

export default function Home(){
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJoke();
    }, []);

    const fetchJoke = async () => {
        try {
            setLoading(true);
            setError("");
            
            const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
            
            if (!response.ok) {
                throw new Error("Failed to fetch joke");
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.message);
            }
            
            setJoke(data.joke);
        } catch (err) {
            setError("Failed to load joke. Please try again later.");
            console.error("Joke API error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewJoke = () => {
        fetchJoke();
    };

    return (
        <div className="home-container">
            <h1>Pocetna strana</h1>
            <p>Kviz Master je onlajn kviz igrica koja proverava Vase znanje iz oblasti web tehnologija. Razvijena je u Unity engine-u u C# programskom jeziku</p>
            
            <div className="joke-section">
                <h2>Programerska sala dana:</h2>
                
                {loading ? (
                    <div className="joke-loading">Ucitavanje sale...</div>
                ) : error ? (
                    <div className="joke-error">{error}</div>
                ) : (
                    <div className="joke-content">
                        <p className="joke-text">"{joke}"</p>
                        <button onClick={handleNewJoke} className="new-joke-btn">
                            Nova sala
                        </button>
                    </div>
                )}
                
                <div className="api-info">
                    <small>Javni veb servis <a href="https://jokeapi.dev/" target="_blank" rel="noopener noreferrer">JokeAPI</a></small>
                </div>
            </div>
        </div>
    ) 
}