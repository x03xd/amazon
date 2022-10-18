import {useNavigate} from 'react-router-dom';
import stylesLogin from './Login.module.css';
import {useEffect, useState} from 'react';
import CSRFToken from './CSRFToken.js';

export default function Login(props){

    const [data, setData] = useState(null);

    const navigate = useNavigate();



    return(
        <div className = "modal-container classic-border">
            <p>Zaloguj się</p>

            <form action = "" method = "POST">
                <CSRFToken />
                <label htmlFor = "id-1">E-mail lub numer telefonu komórkowego</label>

                <input name = 'username' className = "text-input login" type = "text" id = "id-1"/><br/>
                <input type = "submit" className = "login-button login" value = "Dalej"/>
            </form>

            <div id = "text-E01">
                Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.<br/>
                <a href = "#">Potrzebujesz pomocy?</a>
            </div>


        </div>

    );
}