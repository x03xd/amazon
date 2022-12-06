import { useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';


export default function Checkbox(props){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState(props.array);

    //ZEBY MOC NA TYM DZIALA I NIE DOSTAWIC NULLOW NAJPIERW TRZEBA SAMYM SETTEREM PODZIALAC DAJAC DEFAULTOWE WARTOSCI W TAGBLICY A POTEM OBA
    // USTAWIAMY nowy array state z poprzednim local storage sprzed refresha
    console.log(items);

    // zapisuje do array state nasze localstorage sprzed refresha tak aby sie nie resetowalo do defaulowegto false false false...
    useEffect(() => {
    //getter
        items.map((item, index) => {
            //setItems(JSON.parse(localStorage.getItem(index))); []
            items[index] = JSON.parse(localStorage.getItem(index));

        });
    },[]);



    //mozliwosc zmian i nowe state array z gettera powoduje tutaj ze nie nadpisujemy false false false
    useEffect(() => {
    //setter
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
       // window.location.reload()
    }

    //console.log(JSON.parse(localStorage.getItem("2")));
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