import {useNavigate, useParams, useLocation} from 'react-router-dom';
import stylesLogin from './css_modules/Login.module.css';
import {useEffect, useState, useRef} from 'react';
import CSRFToken from './CSRFToken.js';
import logo from './images/xd.png';
import Alert from './Alert';

export default function Login(props){

    let formInput = useRef(null);
    let textInput = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [alertStyle, setAlertStyle] = useState("hidden");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    function getCookie(name) {
        let cookieValue = null;

        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();

                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                    break;
                }
            }
        }
        return cookieValue;
    }


    useEffect(() => {
        const adress = window.location.href;
        if(adress == 'http://localhost:3000/login' || adress == 'http://localhost:3000/login/'){
            setAlertStyle("hidden");
        }
    })


    function navigateBack(){
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/api/login/', type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    function navigateToPasswordInput(){
        navigate("/login2/", {state: {link: 'http://127.0.0.1:8000/api/login2/', type: 'password', inputValue: 'Zaloguj się', style: 'hidden', style2: 'active', content: 'Hasło'}});
    }

    function navigateToHome(){
        navigate("/");
    }

        async function submitForm(e){

            e.preventDefault();

                let response = await fetch("http://127.0.0.1:8000/api/login/", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                                   'X-CSRFToken': getCookie("csrftoken"),
                    },
                    body: JSON.stringify({'username': textInput.current.value})
                })

                let jsonResponse = await response.json();

                console.log(jsonResponse);
                setUsername(jsonResponse.username)

                if(jsonResponse.authenticated == 'false'){
                    navigateBack();
                    setAlertStyle("active");
                }


                else if(jsonResponse.authenticated == 'true'){
                    navigateToPasswordInput();
                    setAlertStyle("hidden");
                }

            textInput.current.value = "";
        }


        async function dataToBackend(e){
            e.preventDefault();

            console.log('datatobackend')

            let response = await fetch("http://127.0.0.1:8000/api/login2/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                               'X-CSRFToken': getCookie("csrftoken"),
                },
                body: JSON.stringify({'username': username, 'password': textInput.current.value})
            })

            let jsonResponse = await response.json()

            console.log(jsonResponse);

            if(jsonResponse.password == 'correct'){
                navigateToHome()
                setAlertStyle("hidden");
            }


            if(jsonResponse.password == 'wrong'){
                navigateToPasswordInput()
                setAlertStyle("active");
            }


            textInput.current.value = "";
        }


    return(
        <div className = "modal-container-wrapper">

            <div>
                <Alert style = {alertStyle} />
            </div>

            <div>
                <div className = "modal-container classic-border mt-4">

                    <p>Zaloguj się</p>

                    <p>{email}</p>

                    <form method = "POST" ref = {formInput}>
                        <CSRFToken />
                        <span>{location.state.content}</span>

                        <input ref = {textInput} defaultValue = "" className = "text-input login" type = {location.state.type}  /><br/>

                        <input value = {location.state.inputValue} type = "button" className = {`login-button login ${location.state.style}`} onClick = {submitForm}/>
                        <input value = {location.state.inputValue} type = "button" className = {`login-button login ${location.state.style2}`} onClick = {dataToBackend}/>
                    </form>

                    <div className = {`text-E01 ${location.state.style} mt-4`}>
                        <span  className = "">Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.</span><br/>
                        <a href = "#">Potrzebujesz pomocy?</a>
                    </div>

                    <div className = {`${location.state.style2} p-3 mt-3`} id = "reminder-login">
                         <input type = "checkbox"/>
                         <span>Nie wylogowuj mnie  </span><a href = "#">Szczegóły</a>
                    </div>

                </div>
            </div>
        </div>
    );
}