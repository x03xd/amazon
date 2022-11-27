
import { useState, useEffect, } from 'react';
import {useNavigate, useParams} from 'react-router-dom';

export default function Checkbox(props){

    const navigate = useNavigate();

    function handleClick(e){

        window.location.reload()

        navigate(`/s?q=${props.query}&c=${props.item}`);


    }

    const [brand, setBrand] = useState([]);
    console.log(props.query);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/`)
        .then(response => response.json())
        .then(result => setBrand(result));
    }, [])


    return(
        <>
            <li onClick = {handleClick} key = {props.index}>
                <input name = "c" onClick = {handleClick} type = "checkbox" />
                {props.item}
            </li>
        </>
    );

}