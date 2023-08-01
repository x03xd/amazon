import arrow from './images/left.png';
import React from 'react';


export interface ClearProps{
    nut: string;
    func: (arg: string) => void;
    text: string;
}


const Clear: React.FC<ClearProps> = ({ func, nut, text }) => {

    const searchParams = new URLSearchParams(window.location.search);

    function clearResults(){

        if(nut === "q"){
            searchParams.delete('q');
            func("q")
        }

        if(nut === "c"){
            searchParams.delete('c');
            func("c")
        }

        else if(nut === "u"){
            searchParams.delete('u');
            func("u")
        }

        else if(nut === "rating"){
            searchParams.delete('rating');
            func("rating")
        }

        const modifiedQueryString = searchParams.toString();
        const baseUrl = window.location.href.split('?')[0];
        const updatedUrl = baseUrl + '?' + modifiedQueryString;

        window.location.href = updatedUrl;

    }

    return(
        <div onClick = {() => { clearResults(); }} className = "d-flex align-items-center ms-n2 cursor-pointer">
            <img loading = "lazy" src = {arrow} alt = "arrow" /><span className = "cursor-pointer">{text}</span>
        </div>
    );

}



export default Clear;