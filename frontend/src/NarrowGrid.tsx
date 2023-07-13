
import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import MiniNavbar from './MiniNavbar';
import EditProfileModal from './EditProfileModal';



const NarrowGrid : React.FC = () => {

    //const [modal, setModal] = useState<string>("");

    //const setEditModal = (style: string) => {
    //    setModal(style)
    //}

    return(
        <div className = "narrow-container">
            
            <div>
            </div>
            
            <div>
                <Outlet />
            </div>

            <div>
            </div>

        </div>
    );

}




export default NarrowGrid;