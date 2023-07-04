import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryParamsContext from "./QueryParamsContext";


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

    const searchParams = new URLSearchParams(window.location.search);

    // Set the new value for the query parameter

    let {c_QueryParam, q_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const navigate = useNavigate();

    const [allUniqueContentArray, setAllUniqueContentArray] = useState<PriceRange[] | string[]>(arrayProp); //defined w interfejsie
    const [items, setItems] = useState<boolean[]>(array);

    const [filteredBrands2, setFilteredBrands2] = useState<string[] | []>([]);
    const [filteredPrices2, setFilteredPrices2] = useState<string[] | []>([]);

    const [cLink, setCLink] = useState<string[] | []>([]);
    const [uLink, setULink] = useState<string[] | []>([]);
    const [ratingLink, setRatingLink] = useState<string| null>(localStorage.getItem("rating"));

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingLink, setLoadingLink] = useState<boolean>(false);

    let [oldArray, oldArray3, oldArray4, testArray, testArray2] = [[], [], [], [], []]

    const prevDependencyFilteredBrands2 = useRef<string[] | []>([]);
    const prevDependencyFilteredPrices2 = useRef<string[] | []>([]);
    let uniqueFilteredBrands2 = [...new Set(filteredBrands2)];
    let uniqueFilteredPrices2 = [...new Set(filteredPrices2)];


    useEffect(() => {
        setItems(array)
        setAllUniqueContentArray(arrayProp)
    }, [array, arrayProp])


    useEffect(() => {
        items.map((item: boolean, index: number) => {
            let savedData = localStorage.getItem(nut + index);
            if (savedData) {
                let temp = JSON.parse(savedData);
                let temp2: boolean = temp ? temp.value : "";
                items[index] = temp2;
            }
        });
    }, [items]);
    
 
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

        return null;
        });

    }, [JSON.stringify(items)]);





    useEffect(() => {

        Object.entries(localStorage).map(([key, value], index) => {

            let temp = JSON.parse(localStorage.getItem(key) || "");
            let tempNut = temp ? temp.nut : "";
            let tempValue = temp ? temp.value : "";

            if(tempNut === "c" && tempValue){
                let tempID = temp ? temp.id : "";
                setCLink(testArray => [...testArray, tempID])
            }

            else if(tempNut === "u" && tempValue){
                let tempID = temp ? temp.id : "";
                setULink(testArray2 => [...testArray2, tempID["start"] + "-" + tempID["end"]])
            }
        
            return null;
        });
        
        
        if(loading){
         
            if([...new Set(prevDependencyFilteredBrands2.current)].length !== uniqueFilteredBrands2.length){
                uniqueFilteredBrands2.length === 0 ? searchParams.delete('c') : searchParams.set('c', uniqueFilteredBrands2.join());              
            }


            else if([...new Set(prevDependencyFilteredPrices2.current)].length !== uniqueFilteredPrices2.length){
                uniqueFilteredPrices2.length === 0 ? searchParams.delete('u') : searchParams.set('u', uniqueFilteredPrices2.join());
            }

            const modifiedQueryString = searchParams.toString();
            const baseUrl = window.location.href.split('?')[0];
            const updatedUrl = baseUrl + '?' + modifiedQueryString;
            window.location.href = updatedUrl;

        }

    },[filteredBrands2, filteredPrices2])

    
    function handleResult(e: any, position: number){
        setLoading(true);
        items.map((item : boolean, index : number) => {
            if(index === position) {
                if(!items[index]) {
                    items[index] = true;
                }
                else if(items[index]) {
                    items[index] = false;
                }
            }
        return null;
        });
    }

 
    let savedData = localStorage.getItem(nut + index);
    let ifChecked = savedData ? JSON.parse(savedData) : null;
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