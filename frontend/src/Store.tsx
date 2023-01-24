import Banner from './Banner';
import React, { useState, useEffect, useRef, useContext } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from "react-router-dom";
import UList from './UList';
import Clear from './Clear';
import Rating from './Rating';
import Checkbox from './Checkbox';
import QueryParamsContext from "./QueryParamsContext";
import {priceLimits} from './static_ts_files/priceLimits'

interface Categories {
    id: number;
    category: string;
}


interface Products {
    brand: string;
    description: string;
    gallery1: boolean | null;
    gallery2: boolean | null;
    gallery3: boolean | null;
    id: number;
    image: string;
    price: number;
    quantity: number;
    status?: boolean | null;
    subcategory_name: number;
    title: string;
}


interface Subcategories {
    id: number;
    sub_category: string;
    category_name : number;
}


interface Rate {
    rated_products: string;
    average_rate: number;
}


interface PriceLimits {
    item: {
        desc: string,
        range: {start : number, end : number}
    }
}


const Store: React.FC = () => {

    
    let {q_QueryParam, c_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
    const navigate = useNavigate();


    const [categories, setCategories] = useState<Categories[]>([]);
    const [products, setProducts] = useState<Products[]>([]);
    const [subs, setSubs] = useState<Subcategories[]>([]);
    const [forData, setForData] = useState<Products[]>([]);
    const [averageRate, setAverageRate] = useState<Rate[]>([]);

    const [arrayBrands, setArrayBrands] = useState<string[]>([]);
    const [brandsFalseFilled, setBrandsFalseFilled] = useState<boolean[]>([]);

    const [arrayPrices, setArrayPrices] = useState<PriceLimits[]>([]);
    const [pricesFalseFilled, setPricesFalseFilled] = useState<boolean[]>([]);


    const aRef = useRef<HTMLInputElement>(null);
    const bRef = useRef<HTMLInputElement>(null);
    const cRef = useRef<HTMLInputElement>(null);


        useEffect(() => {

            fetch(`http://127.0.0.1:8000/api/subcategories/`)
            .then(response => response.json())
            .then(result => setSubs(result));

            fetch(`http://127.0.0.1:8000/api/categories/`)
            .then(response2 => response2.json())
            .then(result2 => setCategories(result2));

            fetch(`http://127.0.0.1:8000/api/products/?q=${q_QueryParam}&c=${c_QueryParam}&u=${u_QueryParam}&rating=${rating_QueryParam}`)
            .then(response3 => response3.json())
            .then(result3 => (setProducts(result3)));

            fetch(`http://127.0.0.1:8000/api/products-by-subs/?q=${q_QueryParam}`)
            .then(response4 => response4.json())
            .then(result4 => setForData(result4));

            fetch(`http://127.0.0.1:8000/api/avg-rate`)
            .then(response5 => response5.json())
            .then(result5 => (setAverageRate(result5)));

        },[])

     
   

            for(let product of forData){
                setArrayBrands([...arrayBrands, product.brand]);
            }
                
            for(let i : number = 0; i <= [...new Set(arrayBrands)].length - 1; i++){
                setBrandsFalseFilled([...brandsFalseFilled, false])
            }


        let uniqueArrayBrands  = [...new Set(arrayBrands)];

        for(let nums of priceLimits){
            setArrayPrices([...arrayPrices, nums]);
        }

        let uniqueArrayPrices = [...new Set(arrayPrices)];

        for(let i : number = 0; i <= uniqueArrayPrices.length - 1; i++){
            setPricesFalseFilled([...pricesFalseFilled, false])
        }
    

        function clearQueryString(arg: string){

            switch (arg) {
                case "c":

                    arrayBrands.map((item: any, index: number) => {

                        let storage = JSON.parse(localStorage.getItem("c" + index) || "");
                        let checkStorage = storage ? storage.value : "";

                        if(checkStorage === true){
                            let object = {value: false, nut: "c", id: (uniqueArrayBrands || [])[index] }
                            localStorage.setItem("c" + index, JSON.stringify(object));
                        }

                    })
                    break;

                case "u":
                    arrayPrices.map((item : any, index: number) => {

                        let storage = JSON.parse(localStorage.getItem("u" + index) || "");
                        let checkStorage = storage ? storage.value : "";

                        if(checkStorage === true){
                            let object = {value: false, nut: "u", id: (uniqueArrayPrices || [])[index] }
                            localStorage.setItem("u" + index, JSON.stringify(object));
                        }

                    })
                    break;
            }
            window.location.reload();
        }


        function handleClickSearch(){
            navigate(`?q=${q_QueryParam}&c=${c_QueryParam}&u=${aRef.current?.value}-${bRef.current?.value}&rating=${rating_QueryParam}`);

            window.location.reload();
        }


        function changeQ(qValue: string){
            navigate(`?q=${qValue.toLowerCase()}&c=${c_QueryParam}&u=${u_QueryParam}`);
            window.location.reload();
        }

        const [productsWithRatings, setProductsWithRatings] = useState<JSX.Element[]>([]);
        //let helpArray = []

        aLoop:
        for(let item of products){
            for(let rate of averageRate){

                if(Number(rate["rated_products"]) === item["id"]){

                    setProductsWithRatings([...productsWithRatings, <ProductCard key = {item["id"]} item = {item} rate = {rate["average_rate"]} />])
                   
                    continue aLoop;
                }
            }
        }

        return(
            <div className = "store-content mt-5">

                <div className = "store-content-bar">

                    <div className = "pt-0">
                        <span>Możliwość darmowej dostawy</span> <br/>

                        <input type = "checkbox" /> <a className = "" href = ""> Darmowa wysyłka przez Amazon <br/>
                        Darmowa dostawa dla wszystkich klientów <br/> przy zamówieniach o wartosci powyżej 40 zł, wysyłanych przez Amazon</a>
                    </div>

                     <div>
                        <span>Kategoria</span>

                        <ul>
                            {subs.map((item : any, index: number) => <UList UListFunction = {changeQ} key = {index} item = {item["sub_category"]} /> )}
                        </ul>
                     </div>

                    <div>
                        <span>Recenzja klienta</span>
                        <Rating />
                    </div>


                    <div>
                        <span>Marka</span><br/>
                        <Clear nut = "c" func = {clearQueryString} arrayProp = {uniqueArrayBrands} text = "Wyczyść"/>
                        <ul className = "checkbox-list">
                            {uniqueArrayBrands.map((item, index) => {
                                return(
                                    <Checkbox nut = "c" q = {q_QueryParam} c = {item} u = {u_QueryParam} rating = {rating_QueryParam} index = {index} key = {index} name = {item} array = {brandsFalseFilled} arrayProp = {uniqueArrayBrands} />
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <span>Cena</span>
                        <Clear nut = "u" func = {clearQueryString} arrayProp = {uniqueArrayPrices} text = "Wyczyść"/>
                        <ul className = "checkbox-list">
                            {priceLimits.map((item, index) => {
                                return(
                                    <Checkbox nut = "u" q = {q_QueryParam} c = {c_QueryParam} u = {item.item.range} rating = {rating_QueryParam} index = {index} key = {index} name = {item.item.desc} array = {pricesFalseFilled} arrayProp = {uniqueArrayPrices} />
                                )
                            })}
                        </ul>
                    </div>

                        <div className = "d-flex align-items-center price-filters">
                            <input ref = {aRef} className = "" type = "text" placeholder = "Min"/>
                            <input ref = {bRef} className = "ms-1" type = "text" placeholder = "Max"/>
                            <button onClick = {handleClickSearch} className = "ms-1 border 0">Szukaj</button>
                        </div>
                </div>


                <div className = "store-content-products">
                    <div className = "">
                        <span className = "fw-525">WYNIKI</span><br/>
                        <a className = "text-decoration-none">Dowiedz się o tych wynikach.</a>
                    </div>

                    <div className = "store-content-results mt-3">
                        {productsWithRatings}
                    </div>
                </div>

                <div></div>

            </div>
        );
}

export default Store;