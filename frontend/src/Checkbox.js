import { useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';


export default function Checkbox(props){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState(props.array);

// LOCAl storage SIE ZAPISUJE POTEM REFRESH I NAJPIERW POBIERAMY getItem stare localstorage przed refreshem state gdzie byly same false i mamy jedna tablice=
    useEffect(() => {                                                   // dla state i jedna oddzielna dla localstorage przez co po refr3eshowaniu componentu
                                                                         // nie pobieramy wartosci ze state ale z nowej tablicy i sie nie usuwa!
        items.map((item, index) => {
            //setItems(JSON.parse(localStorage.getItem(index))); []
            items[index] = JSON.parse(localStorage.getItem(index));
            console.log(items);
        });

    },[]);

    console.log(items);

    useEffect(() => {

        items.map((item, index) => {
            localStorage.setItem(index, JSON.stringify(item))
        });

    }, [JSON.stringify(items)]);




    function handleResult(e, position){
        items.map((item, index) => {
            if(index == position) {
                if(items[index] == false) {items[index] = true;}

                else if(items[index] == true) {items[index] = false;}
            }
        });

        navigate(`?q=${props.query}&c=${props.name}/`);
        window.location.reload()
    }

    console.log(JSON.parse(localStorage.getItem("2")));
    /*checked = {JSON.parse(localStorage.getItem(props.index))}*/
    return(
        <>
            <li key = {props.index}>
                <input checked = {JSON.parse(localStorage.getItem(props.index))} name = "c" onChange = {(e) => {handleResult(e, props.index) }} type = "checkbox" />
                {props.name}
            </li>
        </>
    );


}