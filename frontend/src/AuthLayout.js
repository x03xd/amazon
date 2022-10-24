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
                    <div className = "logo-box">
                        <img className = "logo-image" src = {deliverImage} alt = "logo"/>
                        <span className = "logo-text"> DeliverService </span>
                    </div>
                </div>

                <Login />


                <div className = "main-container-auth-layout-create-button">
                    <button className = "login-button">Utwórz nowe konto</button><br/>
                </div>


                <div className = "auth-navbar">
                    <div>
                         <a href = "#">Warunki użytkowania i sprzedaży</a>
                         <a href = "#">Informacja o prywatności </a>
                         <a href = "#">Pomoc </a>
                         <a href = "#">Nota prawna</a>
                         <a href = "#">Cookies</a>
                         <a href = "#">Reklamy dopasowane do zainteresowań</a><br/>

                    <span>© 1996-2022 DeliverService.com, Inc. lub podmioty powiązane</span>
                    </div>
                </div>
        </div>
    );



}