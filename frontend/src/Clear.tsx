import arrow from './images/left.png';
import React from 'react';


interface Item {
    desc: string;
    range: {
        start: number;
        end: number;
    };
}


export interface ClearProps{
    nut: string;
    func: (arg: string) => void;
    text: string;
}


const Clear: React.FC<ClearProps> = ({ func, nut, text }) => {

    const searchParams = new URLSearchParams(window.location.search);

    function clearResults(){

        if(nut === "c"){
            searchParams.delete('c');
            func("c")
        }

        else if(nut === "u"){
            searchParams.delete('u');
            func("u")
        }

        else if(nut === "rating"){
            searchParams.set('rating', "0");
            func("rating")
        }

        const modifiedQueryString = searchParams.toString();
        const baseUrl = window.location.href.split('?')[0];
        const updatedUrl = baseUrl + '?' + modifiedQueryString;

        window.location.href = updatedUrl;

    }

    return(
        <div onClick = {() => { clearResults(); }} className = "d-flex align-items-center ms-n2 cursor-pointer">
            <img src = {arrow} alt = "arrow" /><span className = "cursor-pointer">{text}</span>
        </div>
    );

}



export default Clear;