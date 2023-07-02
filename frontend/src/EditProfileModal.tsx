import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';





interface EditProfileModalProps {
    className: string;
}








const EditProfileModal : React.FC<EditProfileModalProps> = ({className}) => {

    console.log(`edit-profile-modal ${className}`)

    return(
        <div className = "wrapper">
            <div className = {`bg-white edit-profile-modal ${className}`}>
                
                x
            </div>
        </div> 
    )


}



export default EditProfileModal;