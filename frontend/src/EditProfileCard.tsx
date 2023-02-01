import React, {useEffect, useRef, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthContext from "./AuthenticationContext";
import CSRFToken from './CSRFToken';

interface EditProfileCardProps {
    text: string;
    header: string;
    buttonValue: string;
    modalStyleFunction: (style: string) => void;
    id: number;
    link: string;
}



const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, link, header, buttonValue, id, modalStyleFunction }) => {

    const inputValue = useRef<HTMLInputElement>(null)

    const {username} = useContext(AuthContext);

    const submitChange = async (e: any) => {

        e.preventDefault();
 
        try{
            let response = await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                method: 'PATCH',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"change": inputValue.current?.value})
            })
            let responseJSON = await response.json();
            console.log(responseJSON)

                if(responseJSON.status === 200){
                    console.log(responseJSON)
                }


                else{

                }

        }

        catch(error){
            console.log(`Error: ${error}`)
        }



        try{
            let response2 = await fetch(`http://127.0.0.1:8000/api/${link}/${username?.user_id}`, {
                method: 'POST',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({})
            })
            let responseJSON2 = await response2.json();
            console.log(responseJSON2)

                if(responseJSON2.status === 200){
                    console.log(responseJSON2)
                }


                else{

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
                    {id >= 2 ? <span>{text}</span> : <input name = "username" ref = {inputValue} type = "text" defaultValue = {text || ""} />}
                </div>

                <div className = "edit-profile-card-button">
                    <button className = "button-standard-gradient">{buttonValue}</button>
                </div>
            </form>
        </div>
    );

}


export default EditProfileCard