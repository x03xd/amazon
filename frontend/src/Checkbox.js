import { useState, useEffect, useRef } from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';


export default function Checkbox(props){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState(props.array);

    const c = searchParams.get("c");
    const q = searchParams.get("q");
    const u = searchParams.get("u");
    const u2 = searchParams.get("u2");



    useEffect(() => {
        items.map((item, index) => {
            items[index] = JSON.parse(localStorage.getItem(props.nut + index));
        });
    },[]);

    useEffect(() => {
        items.map((item, index) => {
            localStorage.setItem(props.nut + index, JSON.stringify(item))
        });
    }, [JSON.stringify(items)]);


    function handleResult(e, position){
        items.map((item, index) => {
            if(index == position) {
                if(items[index] == false) {
                    items[index] = true;
                    navigate(`?q=${q}&c=${props.c}&u=${props.u}&u2=${props.u2}`);
                }

                else if(items[index] == true) {
                    items[index] = false;
                    (c != null || c != "null") ? navigate(`?q=${q}&c=${c}&u=${u}&u2=${u2}`) : navigate(`?q=${q}`);
                }
            }
        });

        window.location.reload()
    }

   //        console.log(JSON.parse(localStorage.getItem(props.nut + props.index)))


    return(
        <>
            <li key = {props.index}>
                <input ref = {useRef(props.index)} checked = {JSON.parse(localStorage.getItem(props.nut + props.index))} onChange = {(e) => { handleResult(e, props.index); }} type = "checkbox" />
                {props.name}
            </li>
        </>
    );


}