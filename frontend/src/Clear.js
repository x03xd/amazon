import arrow from './images/left.png';
import PropTypes from 'prop-types';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import QueryParamsContext from "./QueryParamsContext";
import {useContext, useState} from 'react';


export default function Clear(props){
    const navigate = useNavigate();
    let {q_QueryParam, c_QueryParam, u_QueryParam, u2_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const [allUniqueContentArray, setAllUniqueContentArray] = useState(props.arrayProp);

    function clearResults(){

        switch (props.nut) {

            case "c":
                navigate(`?q=${q_QueryParam}&c=${null}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                props.func("c");

                break;

            case "u":
                navigate(`?q=${q_QueryParam}&c=${c_QueryParam}&u=${null}&rating=${rating_QueryParam}`);
                props.func("u");

                break;

        }

    }


    return(
        <div onClick = {() => { clearResults(); }} className = "d-flex align-items-center ms-n2 cursor-pointer">
            <img src = {arrow}/><span className = "cursor-pointer">{props.text}</span>
        </div>
    );

}

Clear.defaultProps = {
    text: "Wyczyść",
}