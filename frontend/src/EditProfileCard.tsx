import React, { useRef, useContext } from 'react';
import AuthContext from "./AuthenticationContext";
import CSRFToken from './CSRFToken';
import blocked_padlock from './images/password.png'
import { useNavigate } from 'react-router-dom';

interface EditProfileCardProps {
    text: string;
    header: string;
    buttonValue: string;
    id: number;
    link: string;
    accessLink: string | null;
    access: AccessToChangeUsernameStateProp | null
}


interface AccessToChangeUsernameStateProp {
    username: [boolean, string];
    email: [boolean, string];
    password: [boolean, string];
}

const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, link, header, buttonValue, id, accessLink, access }) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const {username, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const redirectToPasswordChange = () => {
        navigate("password/")
    }

    const submitChange = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        try{
            await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                method: 'PATCH',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"change": inputValue.current?.value})
            })
            logout()

        }
        catch(error){console.log(`Error: ${error}`)}
    }

    console.log(access)

    return(
        <div className = "edit-profile-card">
            <form method = "POST">
                <CSRFToken />
                
                <div className = "edit-profile-card-content">
                    <span>{header}</span> <br/>
                    {id >= 2 ? <span>{text}</span> : <input ref = {inputValue} type = "text" defaultValue = {text || ""} />}
                </div>

                <div className = "edit-profile-card-button">

                    {
                        accessLink !== "password_change_allowed"
                        ?
                        <button onClick = {submitChange} className = "button-standard-gradient">{buttonValue}</button>
                        :
                        <button onClick = {redirectToPasswordChange} className = "button-standard-gradient">{buttonValue}</button>
                    }
                
                    {link === "edit-username" && !access?.username[0] ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" />
                        <span>Do: {access?.username[1]}</span>
                    </>
                    : null}


                    {link === "edit-email" && !access?.email[0] ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> 
                        <span>Do: {access?.email[1]}</span>
                    </>
                    : null}


                    {link === "edit-password" && !access?.password[0] ? 
                    <>
                        <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> 
                        <span>Do: {access?.password[1]}</span>
                    </>
                    : null}

                </div>
            </form>
        </div>
    );

}


export default EditProfileCard