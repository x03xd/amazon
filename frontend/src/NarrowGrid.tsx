
import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import MiniNavbar from './MiniNavbar';



const NarrowGrid : React.FC = () => {



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