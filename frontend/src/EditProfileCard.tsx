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
    username: boolean;
    email: boolean;
    password: boolean
}

const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, link, header, buttonValue, id, accessLink, access }) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const {username} = useContext(AuthContext);
    const navigate = useNavigate();

    const redirectToPasswordChange = () => {
        navigate("password/")
    }

    const submitChange = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const setNewDate = async () => { 

            try{
                const response = await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                    method: 'POST',
                    credentials: 'include', 
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({"access": access})
                })
                let responseJSON = await response.json();
                console.log("post", responseJSON)

            }

            catch(error){
                console.log(`Error: ${error}`)
            }
        }

        try{
            const response = await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                method: 'PATCH',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"access": access, "change": inputValue.current?.value})
            })
            const responseJSON = await response.json();
            console.log("patch", responseJSON)

            if (responseJSON.status) {
                setNewDate();
            }

        }

        catch(error){
            console.log(`Error: ${error}`)
        }

    }


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
                
                    {link === "edit-username" && !access?.username ? <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> : null}
                    {link === "edit-email" && !access?.email ? <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> : null}
                    {link === "edit-password" && !access?.password ? <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> : null}
                </div>
            </form>
        </div>
    );

}


export default EditProfileCard