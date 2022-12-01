
import { useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';

export default function Checkbox(props){

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleClick(e){
        navigate(`?q=${props.query}&c=${props.item}/`);
        window.location.reload()
    }

    return(
        <>
            <li onClick = {handleClick} key = {props.index}>
                <input name = "c" onClick = {handleClick} type = "checkbox" value = {props.item}/>
                {props.item}
            </li>
        </>
    );

}