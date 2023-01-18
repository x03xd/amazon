import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryParamsContext from "./QueryParamsContext";



export default function Checkbox(props){
    const navigate = useNavigate();

    const [items, setItems] = useState(props.array);
    let {c_QueryParam, q_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const [allUniqueContentArray, setAllUniqueContentArray] = useState(props.arrayProp);

    const [filteredBrands2, setFilteredBrands2] = useState([]);
    const [filteredPrices2, setFilteredPrices2] = useState([]);

    const [cLink, setCLink] = useState([]);
    const [uLink, setULink] = useState([]);


    const [loading, setLoading] = useState(false);
    const [loadingLink, setLoadingLink] = useState(false);


    let oldArray = [];
    let oldArray3 = [];
    let oldArray4 = [];
    let testArray = [];
    let testArray2 = [];
    //previous value of state


    useEffect(() => {
        items.map((item, index) => {
            let temp = JSON.parse(localStorage.getItem(props.nut + index));
            let temp2 = temp ? temp.value : "";
            items[index] = temp2;
        });
    },[]);

    const prevDependencyFilteredBrands2 = useRef();
    const prevDependencyFilteredPrices2 = useRef();

    let uniqueFilteredBrands2 = [...new Set(filteredBrands2)];
    let uniqueFilteredPrices2 = [...new Set(filteredPrices2)];

    useEffect(() => {

            prevDependencyFilteredBrands2.current = filteredBrands2;
            prevDependencyFilteredPrices2.current = filteredPrices2;

            setFilteredBrands2([])
            setFilteredPrices2([])

                items.map((item, index) => {

                    let object = {value: item, nut: props.nut, id: props.nut == "c" ? (allUniqueContentArray || [])[index] : (allUniqueContentArray || [])[index]["item"]["range"] }

                    localStorage.setItem(props.nut + index, JSON.stringify(object))

                    let temp = JSON.parse(localStorage.getItem(props.nut + index));

                    if(temp.value == true && temp.nut == "c"){
                        setFilteredBrands2(oldArray => [...oldArray, temp.id])
                    }

                    else if(temp.value == true && temp.nut == "u"){
                        setFilteredPrices2(oldArray3 => [...oldArray3, temp.id["start"] + "-" + temp.id["end"]]);
                    }

                });

    }, [JSON.stringify(items)]);


    useEffect(() => {

        Object.entries(localStorage).map(([key, value], index) => {

            let temp = JSON.parse(localStorage.getItem(key));
            let tempNut = temp ? temp.nut : "";
            let tempValue = temp ? temp.value : "";

            if(tempNut == "c" && tempValue == true){
                let tempID = temp ? temp.id : "";
                setCLink(testArray => [...testArray, tempID])
            }

            else if(tempNut == "u" && tempValue == true){
                let tempID = temp ? temp.id : "";
                setULink(testArray2 => [...testArray2, tempID["start"] + "-" + tempID["end"]])
            }

        });


        if(!loading){

            if(window.location.href == `http://localhost:3000/s?q=${q_QueryParam}` && ([...new Set(cLink)].length > 0 && [...new Set(uLink)].length > 0)){
                console.log(`/s?q=${q_QueryParam}&c=${[...new Set(cLink)].join()}&u${[...new Set(uLink)].join()}`)
                navigate(`?q=${q_QueryParam}&c=${[...new Set(cLink)].join()}&u=${[...new Set(uLink)].join()}`);
                window.location.reload();
            }
        }

        else if(loading){

            if([...new Set(prevDependencyFilteredBrands2.current)].length !== uniqueFilteredBrands2.length){
                if(u_QueryParam == "") {u_QueryParam = "null";}

                if(uniqueFilteredBrands2.length == 0){
                    uniqueFilteredBrands2 = "null";
                    navigate(`?q=${props.q}&c=${uniqueFilteredBrands2}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                }

                else{
                    navigate(`?q=${props.q}&c=${uniqueFilteredBrands2.join()}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                }

            }

            else if([...new Set(prevDependencyFilteredPrices2.current)].length !== uniqueFilteredPrices2.length){
                if(c_QueryParam == "") {c_QueryParam = "null";}

                if(uniqueFilteredPrices2.length == 0){
                    uniqueFilteredPrices2 = "null";
                    navigate(`?q=${props.q}&c=${c_QueryParam}&u=${uniqueFilteredPrices2}&rating=${rating_QueryParam}`);
                }

                else{
                    navigate(`?q=${props.q}&c=${c_QueryParam}&u=${uniqueFilteredPrices2}`);
                }

                navigate(`?q=${props.q}&c=${c_QueryParam}&u=${uniqueFilteredPrices2.join()}&rating=${rating_QueryParam}`);
            }


            window.location.reload()
        }

    },[filteredBrands2, filteredPrices2])




    function handleResult(e, position){
        setLoading(true);

        items.map((item, index) => {
            if(index == position) {
                if(items[index] == false) {
                    items[index] = true;
                }

                else if(items[index] == true) {
                    items[index] = false;
                }
            }
        });
    }

    let ifChecked = JSON.parse(localStorage.getItem(props.nut + props.index));
    let ifChecked2 = ifChecked ? ifChecked.value : false;

    return(
        <>
            <li key = {props.index}>

                <input ref = {useRef(props.index)} checked = {ifChecked2} onChange = {(e) => { handleResult(e, props.index); }} type = "checkbox" />
                {props.name}
            </li>
        </>
    );


}