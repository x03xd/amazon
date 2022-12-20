import {Outlet, useNavigate} from 'react-router-dom';
import logo from './images/xd2.webp';
import Login from './Login';
import Register from './Register';
import {useState, useEffect} from 'react';
import Alert from './Alert';
import { useOutletContext, useSearchParams } from "react-router-dom";


export default function AuthLayout(props){

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [generatedText, setGeneratedText] = useState("");
    const [buttonStyle, setButtonStyle] = useState("");
  //  const [styleAlert, setStyleAlert] = useState("");

    useEffect(() => {
        const adress = window.location.href;
        if(adress == 'http://localhost:3000/login2' || adress == 'http://localhost:3000/login2/' || adress == "http://localhost:3000/registration" || adress == "http://localhost:3000/registration/"){
            setButtonStyle("hidden");
        }
    })

  //  function setStyle(style){
   //     setStyleAlert(style)
  //  }


    return(
        <>

            <div className = "main-container-auth-layout-title">
                <div className = "logo-box">
                    <img className = 'logo mt-4' src = {logo} />
                </div>

            </div>



            <div className = "main-container-auth-layout mt-4">
                    <Outlet />

                    <div className = "main-container-auth-layout-create-button">
                        <button className = {`login-button ${buttonStyle}`}>Utwórz nowe konto</button><br/>
                    </div>


                    <div className = "auth-navbar">
                        <div className = "mt-3">
                             <a href = "#">Warunki użytkowania i sprzedaży</a>
                             <a href = "#">Informacja o prywatności </a>
                             <a href = "#">Pomoc </a>
                             <a href = "#">Nota prawna</a>
                             <a href = "#">Cookies</a>
                             <a href = "#">Reklamy dopasowane do zainteresowań</a><br/>

                            <span>© 1996-2022 DeliverService.com, Inc. lub podmioty powiązane</span>
                        </div>
                    </div>
            </div>
        </>
    );

}