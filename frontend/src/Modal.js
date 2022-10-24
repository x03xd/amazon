import {useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

export default function Modal(props){

    const navigate = useNavigate();


    const navigateTo = () => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }



    return(
        <div className = {`login-modal ${props.className}`}>

            <div>
                <button onClick = {() => { navigateTo() }} className = "login-button">Zaloguj się</button>

                <span>Pierwszy raz w serwisie Amazon?</span> <br/>
                <a href = "#">Rozpocznij tutaj.</a>
            </div>



            <div>
                <div>
                    <ul>
                        <li>Moje listy</li>
                        <li>Utwórz listę zakupów</li>
                    </ul>
                </div>

                <div>
                    <ul>
                        <li>Moje konto</li>
                        <li>Moje konto</li>
                        <li>Moje zamówienia</li>
                        <li>Kup ponownie</li>
                        <li>Moje rekomendacje</li>
                        <li>Mój Prime</li>
                        <li>Sprzedawaj na Amazon</li>
                    </ul>
                </div>
            </div>

        </div>
    );



}