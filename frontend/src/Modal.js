import {useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

export default function Modal(props){

    const navigate = useNavigate();

    const navigateTo = () => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }


    return(
        <div className = {`login-modal ${props.className}`}>

            <div className = "p-3">
                <button onClick = {() => { navigateTo() }} className = "login-button">Zaloguj się</button>

                <span className = 'cr-black mt-4'>Pierwszy raz w serwisie Amazon?</span> <br/>
                <a className = 'cr-black' href = "#">Rozpocznij tutaj.</a>
            </div>



            <div>
                <div>
                    <ul className = "p-5">
                        <li className = 'cr-black'>Moje listy</li>
                        <li className = 'cr-black'>Utwórz listę zakupów</li>
                    </ul>
                </div>

                <div>
                    <ul className = "p-5">
                        <li className = 'cr-black'>Moje konto</li>
                        <li className = 'cr-black'>Moje konto</li>
                        <li className = 'cr-black'>Moje zamówienia</li>
                        <li className = 'cr-black'>Kup ponownie</li>
                        <li className = 'cr-black'>Moje rekomendacje</li>
                        <li className = 'cr-black'>Mój Prime</li>
                        <li className = 'cr-black'>Sprzedawaj na Amazon</li>
                    </ul>
                </div>
            </div>

        </div>
    );



}