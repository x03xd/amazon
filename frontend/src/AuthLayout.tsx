import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import logo from './images/xd2.webp';
import React, {useState, useEffect} from 'react';

const AuthLayout: React.FC = () => {

    const navigate = useNavigate();
    const [buttonStyle, setButtonStyle] = useState("");
    const location = useLocation();

    useEffect(() => {
        if(['/login2', '/login2/', 'registration', 'registration/'].includes(location.pathname)){
            setButtonStyle("hidden");
        }
    }, [])

    const navigateTo = () => {
        navigate("/registration");
    } 

    return(
        <>
            <div className = "main-container-auth-layout-title">
                <div className = "logo-box">
                    <img className = 'logo mt-4' src = {logo} alt = "logo"/>
                </div>

            </div>


            <div className = "main-container-auth-layout mt-4">
                    <Outlet />

                    <div className = "main-container-auth-layout-create-button">
                        {(['/login', '/login/'].includes(location.pathname))
                        ? 
                        <button className = {`login-button ${buttonStyle}`} onClick = {navigateTo} >Utwórz nowe konto</button>     
                        :
                        <></>     
                        }       
                    </div>

                    <div className = "auth-navbar">
                        <div className = "mt-3">
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
        </>
    );

}

export default AuthLayout