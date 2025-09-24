import React from 'react';
import UnityGame from '../components/UnityGame';
import './Kviz.css';
import { Unity, useUnityContext } from 'react-unity-webgl';


export default function Kviz(){
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "/game-build/Build/game-build.loader.js",
        dataUrl: "/game-build/Build/game-build.data.unityweb",
        frameworkUrl: "/game-build/Build/game-build.framework.js.unityweb",
        codeUrl: "/game-build/Build/game-build.wasm.unityweb"
    });

    return (
        <div className="kviz-page">
            <div className="kviz-header">
                <h1>Kviz Master</h1>
                <p>Testiraj svoje znanje...</p>
            </div>

            <div className="game-section">
        
                <div className="unity-container">
                    {!isLoaded && (
                        <div className="loading-overlay">
                            <div className="loading-text">
                                Ucitavanje: {Math.round(loadingProgression * 100)}%
                            </div>
                            <div className="loading-bar">
                            <div 
                                className="loading-progress"
                                style={{ width: `${loadingProgression * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    )}
          
                    <Unity 
                        unityProvider={unityProvider}
                        style={{
                            width: "100%",
                            borderRadius: "0.5rem",
                            display: isLoaded ? "block" : "none"
                        }}
                    />
                </div>
            </div>

        <div className="download-section">
            <button className="download-btn">
                Preuzmi pitanja
            </button>
            <p className="download-note">Dostupno kao .csv fajl!</p>
        </div>
    </div>
    );
};
