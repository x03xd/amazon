import {useNavigate, useParams, useLocation} from 'react-router-dom';
import stylesLogin from './Login.module.css';
import {useEffect, useState, useRef} from 'react';
import CSRFToken from './CSRFToken.js';


export default function Login(props){



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






    let formInput = useRef(null);
    let textInput = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");


    function navigateBack(){
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', type: 'text', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    function navigateToPasswordInput(){
        navigate("/login2/", {state: {link: 'http://127.0.0.1:8000/login2/', type: 'password', inputValue: 'Zaloguj się', style: 'hidden', style2: 'active', content: 'Hasło'}});
    }

    function navigateToHome(){
        navigate("/");
    }

        async function submitForm(e){
            e.preventDefault();

                let response = await fetch("http://127.0.0.1:8000/login/", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({'username': textInput.current.value})
                })

                let jsonResponse = await response.json();

                console.log(jsonResponse);
                setUsername(jsonResponse.username)

                if(jsonResponse.authenticated == 'false'){
                    navigateBack()
                }


                else if(jsonResponse.authenticated == 'true'){
                    navigateToPasswordInput()
                }

            textInput.current.value = "";
        }


        async function dataToBackend(e){
            e.preventDefault();

            console.log('datatobackend')

            let response = await fetch("http://127.0.0.1:8000/login2/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({'username': username, 'password': textInput.current.value})
            })

            let jsonResponse = await response.json()

            console.log(jsonResponse);

            if(jsonResponse.password == 'correct'){
                navigateToHome()
            }


            if(jsonResponse.password == 'wrong'){
                navigateToPasswordInput()
            }


            textInput.current.value = "";
        }



    return(
        <div className = "modal-container-wrapper">
            <div className = "modal-container classic-border">

                <p className = "fs-26">Zaloguj się</p>

                <p>{email}</p>


                <form method = "POST" ref = {formInput} action = {location.state.link}>
                    <CSRFToken />

                    <label htmlFor = "id-1">{location.state.content}</label><br/>

                    <input ref = {textInput} defaultValue = "" className = "text-input login" type = {location.state.type} id = "id-1"  /><br/>

                    <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style}`} onClick = {submitForm}/>
                    <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style2}`} onClick = {dataToBackend}/>
                </form>


                <div className = {`text-E01 ${location.state.style} p-3`} id = "text-E01">
                    <span className = "fs-11 p-3">Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.</span><br/>
                    <a className = "fs-12" href = "#">Potrzebujesz pomocy?</a>
                </div>

                <div className = {`${location.state.style2} p-3`} id = "reminder-login">
                     <input className = 'flex' type = "checkbox"/>
                     <span className = "fs-12">Nie wylogowuj mnie  </span><a className = "fs-12" href = "#">   Szczegóły</a>
                </div>

            </div>
        </div>
    );
}
