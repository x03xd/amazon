import arrow from './images/left.png';
import PropTypes from 'prop-types';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import QueryParamsContext from "./QueryParamsContext";
import React, {useContext, useState} from 'react';


interface Item {
    desc: string;
    range: {
        start: number;
        end: number;
    };
}




interface ArrayProps {
    item: Item;
}


export interface ClearProps{
    nut: string;
    func: (arg: string) => void;
    text: string;
    arrayProp: ArrayProps[] | string[] | unknown[];
}


const Clear: React.FC<ClearProps> = ({ func, nut, arrayProp, text }) => {

    const navigate = useNavigate();
    let {q_QueryParam, c_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const [allUniqueContentArray, setAllUniqueContentArray] = useState(arrayProp);

    function clearResults(){

        switch (nut) {

            case "c":
                navigate(`?q=${q_QueryParam}&c=${null}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                func("c");

                break;

            case "u":
                navigate(`?q=${q_QueryParam}&c=${c_QueryParam}&u=${null}&rating=${rating_QueryParam}`);
                func("u");

                break;

        }

    }

    return(
        <div onClick = {() => { clearResults(); }} className = "d-flex align-items-center ms-n2 cursor-pointer">
            <img src = {arrow}/><span className = "cursor-pointer">{text}</span>
        </div>
    );

}



export default Clear;