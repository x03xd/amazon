
import { useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';

export default function Checkbox(props){

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState([]);

    function handleClick(e){

         navigate(`?q=${props.query}&c=${props.item}/`);
         window.location.reload()

         //if (e.target.type === 'checkbox') {
             //let items = JSON.parse(localStorage.setItem('items'));
         //}
    }



    const [isChecked, setIsChecked] = useState(localStorage.getItem('checkbox') === 'true');


    return(
        <>
            <li onClick = {handleClick} key = {props.index}>
                <input name = "c" onClick = {handleClick} type = "checkbox" value = {props.item}/>
                {props.item}
            </li>
        </>
    );

}