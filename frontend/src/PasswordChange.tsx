import {useNavigate} from 'react-router-dom';
import React, {useContext, useState, useRef} from 'react';
import CSRFToken from './CSRFToken';
import Alert from './Alert';
import AuthContext from "./AuthenticationContext";

const PasswordChange: React.FC = () => {
    
    const currentRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const password2Ref = useRef<HTMLInputElement>(null);
    
    const [dangerBorder, setDangerBorder] = useState("");
    const [alertText, setAlertText] = useState<string>("");
    const [alertStyle, setAlertStyle] = useState<string>("hidden");

    const {username, logout} = useContext(AuthContext);
    const navigate = useNavigate(); 

    async function changePassword(e: React.FormEvent){
        e.preventDefault();

        if(passwordRef.current?.value !== password2Ref.current?.value){
            setDangerBorder("border border-danger")
        }

        else{

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/edit-password/${username?.user_id}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({"current": currentRef.current?.value, "password":passwordRef.current?.value, "password2":password2Ref.current?.value})
                })
                const responseJSON = await response.json()
                console.log(responseJSON)

                if(responseJSON?.status){
                    setAlertStyle("hidden");
                    logout()
                    navigate("/")
                }
    
                else {
                    setAlertStyle("active");
                    setAlertText(responseJSON?.error);
                }

            }
        
            catch(error){alert('An error occurred. Please try again later.')}
        }
    }


    return(
        <div className = "modal-container-wrapper">

            <div>
                <Alert style = {alertStyle} text = {alertText} />
            </div>

            <div>
                <div className = "modal-container classic-border mt-4">

                    <p>Zmiana hasła</p>

                    <form onSubmit = {changePassword} method = "PATCH">
                        <CSRFToken />
                        <span>Obecne hasło</span>
                        <input type = "password" ref = {currentRef} defaultValue = "" className = "text-input login" /> <br/>

                        <span>Podaj nowe hasło</span>
                        <input type = "password" ref = {passwordRef} defaultValue = "" className = {`text-input login ${dangerBorder}`} /> <br/>

                        <span>*</span>
                        <input type = "password" ref = {password2Ref} defaultValue = "" className = {`text-input login ${dangerBorder}`} /> <br/>

                        <input type = "submit" className = "login-button login" value = "Zmień hasło" />
                    </form>

                    <div className = "text-E01  mt-4">
                    </div>

                </div>
            </div>
        </div>
    );
}




export default PasswordChange