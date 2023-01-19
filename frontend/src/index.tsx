import React, {useContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './Main.tsx';
import AuthLayout from './AuthLayout.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import 'bootstrap/dist/css/bootstrap.min.css'
import Store from './Store.tsx';
import Lobby from './Lobby.tsx';
import Card from './Card.tsx';
import { AuthProvider } from './AuthenticationContext.tsx';
import { QueryParamsProvider } from './QueryParamsContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <Router>
        <AuthProvider>
            <QueryParamsProvider>
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
                        <Route path = "/registration" element = {<Register />} />
                    </Route>

                </Routes>
            </QueryParamsProvider>
        </AuthProvider>
    </Router>
);

