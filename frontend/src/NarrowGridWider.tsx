
import React from 'react';
import {Outlet} from 'react-router-dom';


const NarrowGrid : React.FC = () => {

    return(
        <div className = "narrow-container-wider">
            
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