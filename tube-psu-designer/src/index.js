/*  index.js — Punkt wejœcia aplikacji React
 *  (c) 2025 Wiœnia / PSU Designer
 *  ------------------------------------------------- */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';

// Montowanie aplikacji React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Jeœli chcesz mierzyæ wydajnoœæ aplikacji, przeka¿ funkcjê
// do logowania wyników (np. reportWebVitals(console.log))
// lub wyœlij do punktu analitycznego. Dowiedz siê wiêcej: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();