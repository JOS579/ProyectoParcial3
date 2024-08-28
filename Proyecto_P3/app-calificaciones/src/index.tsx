import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Importa los estilos de los íconos de PrimeIcons
import 'primeicons/primeicons.css';
// Importa los estilos mínimos necesarios de PrimeReact
import 'primereact/resources/primereact.min.css';
// Importa el tema 'arya-orange' de PrimeReact
import 'primereact/resources/themes/arya-orange/theme.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
