import React from 'react';
import {useNavigate} from 'react-router-dom';





interface EditProfileCardProps {
    text: string;
    header: string;
    buttonValue: string;
    modalStyleFunction: (style: string) => void;
    id: number;
}



const EditProfileCard : React.FC<EditProfileCardProps> = ({ text, header, buttonValue, id, modalStyleFunction }) => {

    console.log(id)
    const navigate = useNavigate();

    const setEditModal = (style: string) => {
        modalStyleFunction(style)
    }

    return(
        <div className = "edit-profile-card">
            <div className = "edit-profile-card-content">
                <span>{header}</span> <br/>
                {id >= 3 ? <span>{text}</span> : <input value = {text} />}
            </div>

            <div className = "edit-profile-card-button">
                <button onClick = {() => {setEditModal("active")}} className = "button-standard-gradient">{buttonValue}</button>
            </div>
        </div>
    );

}


export default EditProfileCard