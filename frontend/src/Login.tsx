import { useLocation} from 'react-router-dom';
import React, {useContext} from 'react';
import Alert from './Alert';
import AuthContext from "./AuthenticationContext";


const Login: React.FC = () => {

    const {loginUser, usernameFilter, username, alertStyle, alertText,} = useContext(AuthContext);
    const location = useLocation();

    return(
        <div className = "modal-container-wrapper">

            <div>
                <Alert style = {alertStyle} text = {alertText} />
            </div>

            <div>
                <div className = "modal-container classic-border mt-4">

                    <p>Zaloguj się</p>

                    <p>{username?.email}</p>

                    <form onSubmit = {(['/login', '/login/'].includes(location.pathname)) ? usernameFilter : loginUser} method = "POST">
                        <span>{location.state.content}</span>

                        <input name = "usernameorpassword" defaultValue = "" className = "text-input login" type = {location.state.type} /> <br/>

                        <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style}`} />
                        <input value = {location.state.inputValue} type = "submit" className = {`login-button login ${location.state.style2}`} />
                    </form>

                    <div className = {`text-E01 ${location.state.style} mt-4`}>
                        <span  className = "">Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.</span><br/>
                        <a href = "#">Potrzebujesz pomocy?</a>
                    </div>

                </div>
            </div>
        </div>
    );
}




export default Login