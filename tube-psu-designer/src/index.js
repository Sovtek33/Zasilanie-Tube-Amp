/*  index.js � Punkt wej�cia aplikacji React
 *  (c) 2025 Wi�nia / PSU Designer
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

// Je�li chcesz mierzy� wydajno�� aplikacji, przeka� funkcj�
// do logowania wynik�w (np. reportWebVitals(console.log))
// lub wy�lij do punktu analitycznego. Dowiedz si� wi�cej: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();