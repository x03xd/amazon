import {useLocation} from 'react-router-dom';
import React, {useContext} from 'react';
import CSRFToken from './CSRFToken';
import Alert from './Alert';
import jwt_decode from "jwt-decode";
import AuthContext from "./AuthenticationContext";


const Login: React.FC = () => {

    const location = useLocation();

    let {loginUser, usernameFilter, email, alertStyle, alertText} = useContext(AuthContext);

    return(
        <div className = "modal-container-wrapper">

            <div>
                <Alert style = {alertStyle} text = {alertText} />
            </div>

            <div>
                <div className = "modal-container classic-border mt-4">

                    <p>Zaloguj się</p>

                    <p>{email}</p>

                    <form onSubmit = {(['/login', '/login/'].includes(location.pathname)) ? usernameFilter : loginUser} method = "POST">
                        <CSRFToken />
                        <span>{location.state.content}</span>

                        <input name = "usernameorpassword" defaultValue = "" className = "text-input login" type = {location.state.type} /> <br/>

                        <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style}`} />
                        <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style2}`} />
                    </form>

                    <div className = {`text-E01 ${location.state.style} mt-4`}>
                        <span  className = "">Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.</span><br/>
                        <a href = "#">Potrzebujesz pomocy?</a>
                    </div>

                    <div className = {`${location.state.style2} p-3 mt-3`} id = "reminder-login">
                        <input type = "checkbox"/>
                        <span>Nie wylogowuj mnie</span><a href = "#">Szczegóły</a>
                    </div>

                </div>
            </div>
        </div>
    );
}




export default Login