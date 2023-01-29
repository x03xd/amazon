
import React from 'react';
import {Outlet} from 'react-router-dom';





const NarrowGrid : React.FC = () => {



    return(
        <div className = "narrow-container">
            
            <div className = "bg-white">

            </div>

            <div className = "bg-white">
                <Outlet />
            </div>

            <div className = "bg-white">

            </div>

        </div>
    );

}







export default NarrowGrid;