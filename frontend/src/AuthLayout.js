import {Outlet, useNavigate} from 'react-router-dom';
import logo from './images/xd.png';
import Login from './Login';
import Register from './Register';
import {useState} from 'react';

export default function AuthLayout(props){

    const navigate = useNavigate();

    return(

        <div className = "main-container-auth-layout">
                <div className = "main-container-auth-layout-title">
                    <div className = "logo-box">
                        <img className = 'logo mt-2 ms-4' src = {logo} />
                    </div>
                </div>

                <Login />


                <div className = "main-container-auth-layout-create-button">
                    <button className = "login-button">Utwórz nowe konto</button><br/>
                </div>


                <div className = "auth-navbar">
                    <div>
                         <a className = 'cr-black' href = "#">Warunki użytkowania i sprzedaży</a>
                         <a className = 'cr-black' href = "#">Informacja o prywatności </a>
                         <a className = 'cr-black' href = "#">Pomoc </a>
                         <a className = 'cr-black' href = "#">Nota prawna</a>
                         <a className = 'cr-black' href = "#">Cookies</a>
                         <a className = 'cr-black' href = "#">Reklamy dopasowane do zainteresowań</a><br/>

                    <span className = 'cr-black'>© 1996-2022 DeliverService.com, Inc. lub podmioty powiązane</span>
                    </div>
                </div>
        </div>
    );

}