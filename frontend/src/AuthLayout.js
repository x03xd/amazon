import {Outlet, useNavigate} from 'react-router-dom';
import deliverImage from './logo.png';
import Login from './Login';
import Register from './Register';
import {useState} from 'react';

export default function AuthLayout(props){

    const navigate = useNavigate();

    return(
        <div className = "main-container-auth-layout">

            <div className = "main-container-auth-layout-title">
                <img className = "logo-image" src = {deliverImage} alt = "logo"/>
                <span className = "logo-text"> DeliverService </span>
            </div>

            <Login />

            <div className = "main-container-auth-layout-3">
                <button className = "login-button">Utwórz nowe konto</button>
            </div>


            <div>
                <div>
                     <a href = "#">Warunki użytkowania i sprzedaży</a>
                     <a href = "#">Informacja o prywatności </a>
                     <a href = "#">Pomoc </a>
                     <a href = "#">Nota prawna</a>
                     <a href = "#">Cookies</a>
                     <a href = "#">Reklamy dopasowane do zainteresowań</a><br/>
                </div>
                <span>© 1996-2022 DeliverService.com, Inc. lub podmioty powiązane</span>
            </div>

        </div>
    );



}