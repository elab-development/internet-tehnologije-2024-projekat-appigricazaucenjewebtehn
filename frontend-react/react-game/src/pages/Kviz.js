import React from 'react';
import UnityGame from '../components/UnityGame';
import './Kviz.css';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useState, useEffect, useRef } from 'react';
import { useSessionStorage, logoutUser } from '../hooks/useSessionStorage';


export default function Kviz(){
    const [unityScore, setUnityScore] = useState(0);
    const token = useSessionStorage('auth_token');
    const userData = useSessionStorage('user_data');
    const isUserLoggedIn = !!token && !!userData;

    const lastScoreSent = useRef(0);
    const isSending = useRef(false);

     useEffect(() => {
        window.receiveScoreFromUnity = (score) => {
            setUnityScore(score);
            
            if (isUserLoggedIn && !isSending.current && score !== lastScoreSent.current) {
                saveScoreToDatabase(score);
            }
        };

        return () => {
            window.receiveScoreFromUnity = null;
        };
    }, [isUserLoggedIn]);

    const saveScoreToDatabase = async (score) => {
        if (isSending.current) return;
        
        isSending.current = true;
        lastScoreSent.current = score;

        try {
            if (!isUserLoggedIn) return;

            console.log('Saljem score na backend:', score);
            console.log('User data:', userData);
            console.log('Token:', token);

            const requestBody = {
                playerId: userData.id,
                score: score,
                completed: true
            };

            console.log('Request body:', requestBody);

            const response = await fetch('http://localhost:8000/api/v1/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('Score saved to database:', score);
            }
        } catch (error) {
            console.error('Error saving score:', error);
        } finally {
            isSending.current = false;
        }
    };

    const handleDownload = async () => {
        
        try {
            const response = await fetch('http://localhost:8000/api/v1/questions/download-csv');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            //blob (binary large objekat) predstavlja sirove podatke i sluzi da http response pretvaramo u sirove podatke pa u fajl
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'questions.csv';
            
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }
            
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Došlo je do greške pri preuzimanju fajla.');
        }
    };

    return (
        <div className="container">
            <div className="kviz-header">
                <h1>Kviz Master</h1>
                <p>Testiraj svoje znanje...</p>
            </div>
            <div className="game-section">
                <UnityGame />
            </div>

            <div className="game-info">
                <h3>Rezultat: {unityScore} poena</h3>
                
                {/* Status autentifikacije */}
                <div className={`auth-status ${isUserLoggedIn ? 'logged-in' : 'logged-out'}`}>
                    {isUserLoggedIn ? (
                        <span>Prijavljeni ste kao: <strong>{userData.email}</strong></span>
                    ) : (
                        <span>Igrate kao gost - rezultat se neće sačuvati</span>
                    )}

                    {isUserLoggedIn && unityScore > 0 && (
                        <div className="score-actions">
                        </div>
                    )}
                </div>
            </div>

            <div className="download-section">
                <button 
                    className="download-btn"
                    onClick={handleDownload}
                >
                    Preuzmi pitanja
                </button>
                <p className="download-note">Dostupno kao .csv fajl!</p>
            </div>
    </div>
    );
};
