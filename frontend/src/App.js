import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home'; // Page d'accueil
import Login from './pages/Login'; // Page de connexion
import Register from './pages/Register'; // Page d'inscription
import ObjectList from './pages/ObjectList'; // Page pour lister les objets

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />  //Route pour la page d'accueil
        <Route path="/login" component={Login} /> // Route pour la page de connexion//
        <Route path="/register" component={Register} /> // Route pour la page d'inscription//
        <Route path="/objects" component={ObjectList} /> // Route pour lister les objets
      </Switch>
    </Router>
  );
}

export default App;
