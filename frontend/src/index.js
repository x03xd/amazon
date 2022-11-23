import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './Main.js';
import AuthLayout from './AuthLayout';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css'
import Store from './Store';
import Lobby from './Lobby';
import Card from './Card';

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
    <Router>
        <Routes>

            <Route element = {<App />}>
                <Route path = "/" element = {<Main />} />
                <Route path = "/s" element = {<Store />} />
                <Route path = "/l/:slug" element = {<Lobby />} />
                <Route path = "/card" element = {<Card />} />
            </Route>


            <Route element = {<AuthLayout />} >
                <Route path = "/login" element = {<Login />} />
                <Route path = "/login2" element = {<Login />} />
            </Route>

        </Routes>
    </Router>
);

