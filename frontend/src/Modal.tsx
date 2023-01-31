import React, {useState, useEffect, useContext} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import AuthContext from "./AuthenticationContext";


export interface ModalProps{
    className: string;
    modalOFF: (style : string) => void;
    overlayOFF: (style : string) => void;
    navbarStatus: (style : string) => void;
}


const Modal: React.FC<ModalProps> = ({ className, modalOFF, overlayOFF, navbarStatus}) => {

    const navigate = useNavigate();


    const navigateTo = () => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }


    const navigateToMyAccount = (style: string) => {
        modalOFF(style)
        overlayOFF(style)
        navbarStatus("")
        navigate("/account/");
    }

    
    let {logout, username} = useContext(AuthContext)

    return(
        <div className = {`login-modal ${className}`}>

            <div className = "p-3">
                <button onClick = {() => { navigateTo() }} className = "login-button">Zaloguj się</button>
                {username != null? <span></span>:
                    <>
                        <span className = {`mt-4`}>Pierwszy raz w serwisie Amazon?</span> <br/>
                        <span className = "link" onClick = {() => {navigate("/registration")}}>Rozpocznij tutaj.</span>
                    </>
                }
            </div>
            
            
            <div className = "d-flex">
                <div className = "line-separator mt-2"></div>
            </div>      

            <div>
                <div>
                    <ul className = "p-5">
                        <li>Moje listy</li>
                        <li>Utwórz listę zakupów</li>
                    </ul>
                </div>

                <div>
                    <ul className = "p-5">
                        <li>Moje konto</li>
                        <li onClick = {() => {navigateToMyAccount("hidden")}}>Moje konto</li>
                        <li>Moje zamówienia</li>
                        <li>Kup ponownie</li>
                        <li>Moje rekomendacje</li>
                        <li>Mój Prime</li>
                        <li>Sprzedawaj na Amazon</li>
                        {username == null ? <span></span> : <li className = " link mt-4" onClick = {logout}>Wyloguj się</li>}
                    </ul>
                </div>
            </div>

        </div>
    );

}

export default Modal;