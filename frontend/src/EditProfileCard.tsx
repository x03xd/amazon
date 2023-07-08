import React, {useEffect, useRef, useContext, useState} from 'react';
import AuthContext from "./AuthenticationContext";
import CSRFToken from './CSRFToken';
import blocked_padlock from './images/password.png'

interface EditProfileCardProps {
    text: string;
    header: string;
    buttonValue: string;
    modalStyleFunction: (style: string) => void;
    id: number;
    link: string;
    accessLink: string | null;
    access: AccessToChangeUsernameStateProp | null
}


interface AccessToChangeUsernameStateProp {
    username: boolean;
    email: boolean;
}

const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, link, header, buttonValue, id, modalStyleFunction, accessLink, access }) => {

    const inputValue = useRef<HTMLInputElement>(null)
    const {username} = useContext(AuthContext);

    const submitChange = async (e: React.FormEvent<HTMLFormElement>) => {
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
                console.log(responseJSON)

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
            console.log(responseJSON)

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
            <form onSubmit = {submitChange} method = "POST">
                <CSRFToken />
                
                <div className = "edit-profile-card-content">
                    <span>{header}</span> <br/>
                    {id >= 2 ? <span>{text}</span> : <input ref = {inputValue} type = "text" defaultValue = {text || ""} />}
                </div>

                <div className = "edit-profile-card-button">
                    <button className = "button-standard-gradient">{buttonValue}</button>

                    {link === "edit-username" && !access?.username ? <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> : null}
                    {link === "edit-email" && !access?.email ? <img src = {blocked_padlock} alt = "blocked" loading = "lazy" /> : null}
                </div>
            </form>
        </div>
    );

}


export default EditProfileCard