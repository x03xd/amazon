import {useNavigate} from 'react-router-dom';
import stylesModal2 from './Modal2.module.css';
import {useEffect, useState} from 'react';

export default function Modal2(props){

    const [data, setData] = useState(null);

    const navigate = useNavigate();



    return(
        <div className = "modal-container">
            <h1>Zaloguj się</h1>

            <form>
                <label htmlFor = "id-1">E-mail lub numer telefonu komórkowego</label>
                <input name = "username" className = "text-input" type = "text" id = "id-1"/>
                <input type = "submit" className = "login-button" value = "dalej"/>
            </form>

            <div id = "text-E01">
                Logując się, wyrażasz zgodę na Warunki użytkowania i sprzedaży Amazon. Zobacz Informację o prywatności, Informację o plikach cookie oraz Informację o reklamach dopasowanych do zainteresowań.<br/>
                <a href = "#">Potrzebujesz pomocy?</a>
            </div>


        </div>

    );
}