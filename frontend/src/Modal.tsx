import {useState, useEffect, useContext} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import AuthContext from "./AuthenticationContext.tsx";

export default function Modal(props){


    const navigate = useNavigate();

    const navigateTo = () => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    const [style, setStyle] = useState("active");

    let {logout} = useContext(AuthContext)

    return(
        <div className = {`login-modal ${props.className}`}>

            <div className = "p-3">
                <button onClick = {() => { navigateTo() }} className = "login-button">Zaloguj się</button>


                {localStorage.getItem("username") == "admin" ? <span className = "mt-4" onClick = {logout}>WYLOGUJ</span> :
                    <>
                        <span className = {`mt-4`}>Pierwszy raz w serwisie Amazon?</span> <br/>
                        <a className = {`$`} href = "#">Rozpocznij tutaj.</a>
                    </>
                }

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