import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

const UnityGame = () => {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/game-build/Build/game-build.loader.js",
    dataUrl: "/game-build/Build/game-build.data.unityweb",
    frameworkUrl: "/game-build/Build/game-build.framework.js.unityweb",
    codeUrl: "/game-build/Build/game-build.wasm.unityweb"
  });

  return (
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
  );
};

export default UnityGame;