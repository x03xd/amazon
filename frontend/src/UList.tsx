

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard.tsx';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";




export default function List(props){

    function handleClick(e){
        props.UListFunction(props.item);
    }

    return(
        <>
            <li key = {props.index} onClick = {handleClick} >
                {props.item}
            </li>
        </>
    );
}