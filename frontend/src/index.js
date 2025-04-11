import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importer le composant principal

ReactDOM.render(
  <React.StrictMode>
    <App /> // Rendre le composant principal
  </React.StrictMode>,
  document.getElementById('root') // Cibler l'élément avec l'ID 'root'
);