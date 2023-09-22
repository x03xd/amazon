import React, { useRef, useContext } from 'react';
import AuthContext from "./AuthenticationContext";
import blocked_padlock from './images/password.png'
import { useNavigate } from 'react-router-dom';
import {DataOfOperation, AccessToChangeUsernameState} from './EditProfile';


interface EditProfileCardProps extends DataOfOperation{
    access: AccessToChangeUsernameState | null
}


const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, link, header, buttonValue, id, accessLink, access, shortcut }) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const {username, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const redirectToPasswordChange = () => {
        if(!access?.password[0]) alert(`You cannot change password till ${!access?.password[1]}`)
        else navigate("password/")
    }

    const submitChange = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                method: 'PATCH',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"change": inputValue.current?.value})
            })
            const responseJSON = await response.json();
            
            if(responseJSON?.status) logout()
            else alert(responseJSON?.error)

        }
        catch(error){alert('An error occurred. Please try again later.');}
    }

    return(
        <div className = "edit-profile-card">
            <div className = "edit-profile-card-grid">
                
                <div className = "edit-profile-card-content">
                    <span>{header}</span> <br/>

                    {
                        id >= 2 ? <span>{text}</span> : (access && access[shortcut as keyof AccessToChangeUsernameState][0] === false ?
                        <input ref = {inputValue} type = "text" defaultValue = {text || ""} readOnly /> : <input ref = {inputValue} type = "text" defaultValue = {text || ""} />)
                    }
                </div>

                <div className = "edit-profile-card-button">

                    {
                        accessLink !== "password_change_allowed"
                        ?
                        <button onClick = {submitChange} className = "button-standard-gradient">{buttonValue}</button>
                        :
                        <button onClick = {redirectToPasswordChange} className = "button-standard-gradient">{buttonValue}</button>
                    }
                
                    {link === "edit-username" && access?.username[0] === false ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" />
                        <span>Do: {access?.username[1]}</span>
                    </>
                    : null}


                    {link === "edit-email" && access?.email[0] === false ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> 
                        <span>Do: {access?.email[1]}</span>
                    </>
                    : null}


                    {link === "change-password" && access?.password[0] === false ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> 
                        <span>Do: {access?.password[1]}</span>
                    </>
                    : null}

                </div>
                
            </div>
        </div>
    );

}



export default EditProfileCard