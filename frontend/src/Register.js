import {useNavigate, useParams, useLocation} from 'react-router-dom';
import stylesLogin from './css_modules/Login.module.css';
import {useEffect, useState, useRef} from 'react';
import CSRFToken from './CSRFToken.js';
import logo from './images/xd.png';
import Alert from './Alert.js';


export default function Register(){


    let usernameRef = useRef(null);
    let emailRef = useRef(null);
    let password1Ref = useRef(null);
    let password2Ref = useRef(null);

    const [dangerBorder, setDangerBorder] = useState("");

    const navigate = useNavigate();

        async function submitForm(e){
            e.preventDefault();

            if(password1Ref.current.value != password2Ref.current.value){
                console.log(dangerBorder);
                setDangerBorder("border border-danger")
            }

            else{

                let response = await fetch("http://127.0.0.1:8000/api/registration/", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({"email":emailRef.current.value, "username":usernameRef.current.value, "password":password1Ref.current.value, "password2":password2Ref.current.value})
                })


                let jsonResponse = await response.json()
                console.log(jsonResponse);

                if(jsonResponse == "done"){
                     navigate("/");
                }

            }

        }

//    let formInput = useRef(null);

    return(
         <div className = "modal-container-wrapper">

            <div className = "modal-container classic-border">

                <p className = "">Utwórz konto</p>

                <form onSubmit = {submitForm} method = "POST">
                    <CSRFToken />
                    <span className = "">Nazwa użytkownika</span>
                    <input ref = {usernameRef} name = "username" defaultValue = "" className = "text-input login" type = "text" placeholder = "Imię i nazwisko" /><br/>

                    <span className = "">Adres e-mail</span>
                    <input ref = {emailRef} name = "email" defaultValue = "" className = "text-input login" type = "text"  /><br/>

                    <span className = "">Hasło</span>
                    <input ref = {password1Ref} name = "password1" defaultValue = "" className = {`text-input login ${dangerBorder}`} type = "password"  placeholder = "Co najmniej 6 znaków" /><br/>

                    <span className = "">Ponownie podaj hasło</span>
                    <input ref = {password2Ref} name = "password2" defaultValue = "" className = {`text-input login ${dangerBorder}`} type = "password"  /><br/>

                    <input value = "Utwórz konto Amazon" type = "submit" className = "login-button login" />
                </form>

                <div className = "mt-4">

                    <input type = "checkbox" /> {'\u00A0'}

                    <span>Zaznacz to pole, aby otrzymywać powiadomienia o nowych produktach, pomysłach na prezenty, specjalnych okazjach, promocjach i nie tylko. Wyrażam zgodę na otrzymywanie informacji marketingowych, w tym okazji i promocji, od Amazon za pomocą środków komunikacji elektronicznej takich jak e-mail. Możesz dostosować zakres lub zrezygnować z otrzymywanych od nas wiadomości, korzystając z karty Moje konto lub ustawień powiadomień w swojej aplikacji lub na urządzeniu mobilnym.</span>

                </div>

                <div className = "mt-5">
                    <span>Masz już konto? </span>
                    <a href = "#">Zaloguj się</a>
                </div>

            </div>
        </div>

    );

}