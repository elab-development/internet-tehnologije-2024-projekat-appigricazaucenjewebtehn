import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./styles.css";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <h1>Hello world !!</h1>
// );

createRoot(document.getElementById("root")).render(
  <App ></App>
);
