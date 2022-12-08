

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";




export default function List(props){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const c = searchParams.get("c");
    const q = searchParams.get("q");
    const u = searchParams.get("u");
    const u2 = searchParams.get("u2");

    function handleClick(e){
        //console.log("x");
        navigate(`?q=${(props.item).toLowerCase()}&c=${c}&u=${u}&u2=${u2}`);
        window.location.reload()
    }

    return(
        <>
            <li key = {props.index} onClick = {handleClick} >
                {props.item}
            </li>
        </>
    );
}