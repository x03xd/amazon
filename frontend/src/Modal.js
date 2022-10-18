import {useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

export default function Modal(props){

    const navigate = useNavigate();

    const navigateTo = () => {
        navigate("/login/");
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