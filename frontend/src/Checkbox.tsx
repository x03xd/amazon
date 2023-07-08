import React, { useState, useEffect, useRef } from 'react';

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

    const [allUniqueContentArray, setAllUniqueContentArray] = useState<PriceRange[] | string[]>(arrayProp); //defined w interfejsie
    const [items, setItems] = useState<boolean[]>(array);

    const [filteredBrands2, setFilteredBrands2] = useState<string[] | []>([]);
    const [filteredPrices2, setFilteredPrices2] = useState<string[] | []>([]);

    const [loading, setLoading] = useState<boolean>(false);

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
            const savedData = localStorage.getItem(nut + index);
            if (savedData) {
                const temp = JSON.parse(savedData);
                const temp2: boolean = temp ? temp.value : "";
                items[index] = temp2;
            }
            return null;;
        });
    }, [items]);
    
 
    function isPriceRange(value: string | PriceRange): value is PriceRange {
        return value !== undefined && (value as PriceRange).item !== undefined;
    }
      

    /* TRIGGERUJE SIE PO ZMIANIE CHECKBOXA I*/

    useEffect(() => {

        prevDependencyFilteredBrands2.current = filteredBrands2;
        prevDependencyFilteredPrices2.current = filteredPrices2;

        setFilteredBrands2([])
        setFilteredPrices2([])
 
        items.map((item, index: number) => {

            const object = {value: item, nut: nut, id: nut === "c" ? (allUniqueContentArray[index]) : isPriceRange(allUniqueContentArray[index]) ? (allUniqueContentArray[index] as PriceRange).item.range : null}

            localStorage.setItem(nut + index, JSON.stringify(object))

            const temp = JSON.parse(localStorage.getItem(nut + index) || "");

            if (temp.value === true && temp.nut === "c") {
                setFilteredBrands2(prevArray => [...prevArray, temp.id]);
            }

            else if (temp.value === true && temp.nut === "u") {
                setFilteredPrices2(prevArray => [...prevArray, temp.id["start"] + "-" + temp.id["end"]]);
            }

        return null;
        });

    }, [JSON.stringify(items)]);


    /* TO SIE TRIGGERUJE PO POWYZSZYM */

    useEffect(() => {

        /* USTAWIA QUERY PRZEKIEROWUJE */
        
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