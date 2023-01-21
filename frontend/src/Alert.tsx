import React from 'react';

export interface AlertProps{
    style: string;
    alert: string;
}


const Alert: React.FC = ({ style, alert }) => {

    console.log(props.style);

    return(
        <div className = {`alert-container-wrapper ${style}`}>
            <div className = "alert-container border border-danger rounded p-4 mt-2">
                <h4 className = "text-danger">Wystąpił błąd</h4>
                <span>{props.text}</span>
            </div>
        </div>
    );

}

export default Alert