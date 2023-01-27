import React from 'react';

interface AlertProps{
    style: string;
    text: string;
}


const Alert: React.FC<AlertProps> = ({ style, text }) => {

    //console.log(style);

    return(
        <div className = {`alert-container-wrapper ${style}`}>
            <div className = "alert-container border border-danger rounded p-4 mt-2">
                <h4 className = "text-danger">Wystąpił błąd</h4>
                <span>{text}</span>
            </div>
        </div>
    );

}

export default Alert