import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryParamsContext from "./QueryParamsContext";
//import { LargeNumberLike } from 'crypto'; //????



interface PriceRange {
    item: {
        desc: string,
        range: {start : number, end : number}
    }
}


interface uQuery {
    start: number;
    end: number;
}


interface CheckboxProps {
    nut: string;
    q: string | null;
    c: string | null;
    u: uQuery | null | string;
    rating: string | null;
    index: number;
    name: string;
    array: boolean[] | string[] | any;
    arrayProp: PriceRange[] | string[];
}



const Checkbox: React.FC<CheckboxProps> = ({ array, arrayProp, name, index, rating, u, c, q, nut }) => {

    let {c_QueryParam, q_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const navigate = useNavigate();

    const [items, setItems] = useState<boolean[]>(array);
    const [allUniqueContentArray, setAllUniqueContentArray] = useState<PriceRange[] | string[]>(arrayProp); //defined w interfejsie
    
    console.log("reren");
    useEffect(() => {
        setItems(array)
        setAllUniqueContentArray(arrayProp)
     
    }, [array, arrayProp])


    const [filteredBrands2, setFilteredBrands2] = useState<string[] | []>([]);
    const [filteredPrices2, setFilteredPrices2] = useState<string[] | []>([]);

    const [cLink, setCLink] = useState<string[] | []>([]);
    const [uLink, setULink] = useState<string[] | []>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingLink, setLoadingLink] = useState<boolean>(false);


    let oldArray = [];
    let oldArray3 = [];
    let oldArray4 = [];
    let testArray = [];
    let testArray2 = [];


    useEffect(() => {
        items.map((item : boolean, index : number) => {
            
            let temp = JSON.parse(localStorage.getItem(nut + index) || "");
            let temp2: boolean = temp ? temp.value : "";
            items[index] = temp2;
            
        });
    },[items]);


    const prevDependencyFilteredBrands2 = useRef<string[] | []>([]);
    const prevDependencyFilteredPrices2 = useRef<string[] | []>([]);

    let uniqueFilteredBrands2 = [...new Set(filteredBrands2)];
    let uniqueFilteredPrices2 = [...new Set(filteredPrices2)];
 

    function isPriceRange(value: string | PriceRange): value is PriceRange {
        return (value as PriceRange).item !== undefined;
    }
      
    useEffect(() => {

            prevDependencyFilteredBrands2.current = filteredBrands2;
            prevDependencyFilteredPrices2.current = filteredPrices2;

            setFilteredBrands2([])
            setFilteredPrices2([])
 

                items.map((item, index: number) => {

                    let object = {value: item, nut: nut, id: nut === "c" ? (allUniqueContentArray[index]) : isPriceRange(allUniqueContentArray[index]) ? (allUniqueContentArray[index] as PriceRange).item.range : null}

                    localStorage.setItem(nut + index, JSON.stringify(object))

                    let temp = JSON.parse(localStorage.getItem(nut + index) || "");

                    if(temp.value === true && temp.nut === "c"){
                        setFilteredBrands2(oldArray => [...oldArray, temp.id])
                    }

                    else if(temp.value === true && temp.nut === "u"){
                        setFilteredPrices2(oldArray3 => [...oldArray3, temp.id["start"] + "-" + temp.id["end"]]);
                    }

                });

    }, [JSON.stringify(items)]);


    

    useEffect(() => {

        Object.entries(localStorage).map(([key, value], index) => {

     
            let temp = JSON.parse(localStorage.getItem(key) || "");
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
                //console.log(`/s?q=${q_QueryParam}&c=${[...new Set(cLink)].join()}&u${[...new Set(uLink)].join()}`)
                navigate(`?q=${q_QueryParam}&c=${[...new Set(cLink)].join()}&u=${[...new Set(uLink)].join()}`);
                window.location.reload();
            }
        }

        else if(loading){
         
            if([...new Set(prevDependencyFilteredBrands2.current)].length !== uniqueFilteredBrands2.length){
                if(u_QueryParam == "") {u_QueryParam = "null";}

                if(uniqueFilteredBrands2.length == 0){
                    let nullQuery : string = "null"
                    navigate(`?q=${q}&c=${nullQuery}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                }

                else{
                    navigate(`?q=${q}&c=${uniqueFilteredBrands2.join()}&u=${u_QueryParam}&rating=${rating_QueryParam}`);
                }

            }

            else if([...new Set(prevDependencyFilteredPrices2.current)].length !== uniqueFilteredPrices2.length){
                if(c_QueryParam == "") {c_QueryParam = "null";}

                if(uniqueFilteredPrices2.length == 0){
                    let nullQuery : string = "null"
                    navigate(`?q=${q}&c=${c_QueryParam}&u=${nullQuery}&rating=${rating_QueryParam}`);
                }

                else{
                    navigate(`?q=${q}&c=${c_QueryParam}&u=${uniqueFilteredPrices2}`);
                }

                navigate(`?q=${q}&c=${c_QueryParam}&u=${uniqueFilteredPrices2.join()}&rating=${rating_QueryParam}`);
            }


            window.location.reload()
        }

    },[filteredBrands2, filteredPrices2])


        function handleResult(e: any, position: number){
        setLoading(true);
     
        items.map((item : boolean, index : number) => {
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

    let ifChecked = JSON.parse(localStorage.getItem(nut + index) || "");
    let ifChecked2 = ifChecked ? ifChecked.value : false;

    return(
        <>
            <li key = {index}>
                <input checked = {ifChecked2} onChange = {(e) => { handleResult(e, index); }} type = "checkbox" />
                {name}
            </li>
        </>
    );

}


export default Checkbox;