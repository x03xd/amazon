import React, { useState, useEffect, useRef, useContext } from 'react';
import ProductCard from './ProductCard';
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
    
        const searchParams = new URLSearchParams(window.location.search);

        const [productsWithRatings, setProductsWithRatings] = useState<JSX.Element[]>([]);
        const [arrayPrices, setArrayPrices] = useState<PriceLimits[]>([]);
        const [pricesFalseFilled, setPricesFalseFilled] = useState<boolean[]>([]);

        const [arrayBrands, setArrayBrands] = useState<string[]>([]);
        const [brandsFalseFilled, setBrandsFalseFilled] = useState<boolean[]>([]);

        const [products, setProducts] = useState<Products[]>([]);
        const [subs, setSubs] = useState<Subcategories[]>([]);
        const [forData, setForData] = useState<Products[]>([]);
        const [averageRate, setAverageRate] = useState<Rate[]>([]);

        const aRef = useRef<HTMLInputElement>(null);
        const bRef = useRef<HTMLInputElement>(null);

        let {q_QueryParam, c_QueryParam, u_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);
        const url = window.location.href;

        const index = url.indexOf('http://localhost:3000/s');
        const queryLinkPart = url.substring(index + 'http://localhost:3000/s'.length);

        useEffect(() => {
            
            try {
                fetch(`http://127.0.0.1:8000/api/subcategories/`)
                .then(response => response.json())
                .then(result => setSubs(result));

                fetch(`http://127.0.0.1:8000/api/products/${queryLinkPart}`)
                .then(response3 => response3.json())
                .then(result3 => (setProducts(result3)));

                fetch(`http://127.0.0.1:8000/api/products-by-subs/?q=${q_QueryParam}`)
                .then(response4 => response4.json())
                .then(result4 => setForData(result4));

                fetch(`http://127.0.0.1:8000/api/avg-rate`)
                .then(response5 => response5.json())
                .then(result5 => (setAverageRate(result5)));;
            }

            catch (error){
                console.error("Error fetching data:", error);
            }

            for(let nums of priceLimits){
                setArrayPrices(ar1 => [...ar1, nums]);
            }   
            
        },[])


        useEffect(() => {
            for(let product of forData){
                setArrayBrands(ar1 => [...ar1, product.brand]);
            }
        },[forData])    
       

        useEffect(() => {
            for(let i : number = 0; i <= [...new Set(arrayPrices)].length - 1; i++){
                setPricesFalseFilled(ar2 => [...ar2, false])
            }
        },[arrayPrices])    
       

        useEffect(() => {        
            for(let i : number = 0; i <= [...new Set(arrayBrands)].length - 1; i++){
                setBrandsFalseFilled(ar2 => [...ar2, false])
            }
        },[arrayBrands])     
        
    



        function clearQueryString(arg: string){

            switch (arg) {
                case "c":

                    arrayBrands.map((item: string, index: number) => {

                        let storage = JSON.parse(localStorage.getItem("c" + index) || "");
                        let checkStorage = storage ? storage.value : "";

                        if(checkStorage){
                            let object = {value: false, nut: "c", id: ([...new Set(arrayBrands)] || [])[index] }
                            localStorage.setItem("c" + index, JSON.stringify(object));
                        }
                    
                        return null;
                    })
                    break;

                case "u":
                    arrayPrices.map((item: any, index: number) => {

                        const storage = JSON.parse(localStorage.getItem("u" + index) || "");
                        const checkStorage = storage ? storage.value : "";

                        if(checkStorage){
                            const object = {value: false, nut: "u", id: ([...new Set(arrayPrices)] || [])[index] }
                            localStorage.setItem("u" + index, JSON.stringify(object));
                        }
                        
                        return null;
                    })
                    break;

                case "rating":
                    arrayPrices.map((item : any, index: number) => {

                        const storage = JSON.parse(localStorage.getItem("rating") || "");
                        const checkStorage = storage ? storage.value : "";

                        if(checkStorage){
                            const object = {value: false, num: 0};
                            localStorage.setItem("rating", JSON.stringify(object));
                        }
                        
                        return null;
                    })
                    break;

            }
            window.location.reload();
        }




        function customPrice(): void{
            searchParams.set('u', `${aRef.current?.value}-${bRef.current?.value}`);
            const modifiedQueryString = searchParams.toString();
            const baseUrl = window.location.href.split('?')[0];
            const updatedUrl = baseUrl + '?' + modifiedQueryString;
            window.location.href = updatedUrl;
        }


        function changeQ(qValue : string): void{
            searchParams.set('q', qValue.toLowerCase());
            const modifiedQueryString = searchParams.toString();
            const baseUrl = window.location.href.split('?')[0];
            const updatedUrl = baseUrl + '?' + modifiedQueryString;
            window.location.href = updatedUrl;
        }


        useEffect(() => {
            aLoop:
            for (let item of products) {
                for (let rate of averageRate) {
                    if (Number(rate["rated_products"]) === item["id"]) {
                        setProductsWithRatings(prevProducts => [
                            ...prevProducts,
                            <ProductCard key={item["id"]} item={item} rate={rate["average_rate"]} />
                        ]);
                        continue aLoop;
                    }
                }
            }
        }, [products, averageRate]);
                

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
                            {subs.map((item, index) => <UList index = {index} UListFunction = {changeQ} key = {index} item = {item["sub_category"]} /> )}
                        </ul>
                     </div>

                    <div>
                        <span>Recenzja klienta</span>
                        <Clear text = "Wyczyść" nut = "rating" func = {clearQueryString}  />
                        <Rating />
                    </div>



                    <div>
                        <span>Marka</span><br/>
                        <Clear text = "Wyczyść" nut = "c" func = {clearQueryString}  />
                        <ul className = "checkbox-list">
                            {[...new Set(arrayBrands)].map((item, index: number) => {
                                return(
                                    <Checkbox nut = "c" q = {q_QueryParam} c = {item} u = {u_QueryParam} rating = {rating_QueryParam} index = {index} key = {index + "c"} name = {item} array = {brandsFalseFilled} arrayProp = {[...new Set(arrayBrands)]} />
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <span>Cena</span>
                        <Clear text = "Wyczyść" nut = "u" func = {clearQueryString} />
                        <ul className = "checkbox-list">
                            {priceLimits.map((item, index: number) => {
                                return(
                                    <Checkbox nut = "u" q = {q_QueryParam} c = {c_QueryParam} u = {item.item.range} rating = {rating_QueryParam} index = {index} key = {index + "u"} name = {item.item.desc} array = {pricesFalseFilled} arrayProp = {[...new Set(arrayPrices)]} />
                                )
                            })}
                        </ul>
                    </div>


                        <div className = "d-flex align-items-center price-filters">
                            <input ref = {aRef} className = "" type = "text" placeholder = "Min"/>
                            <input ref = {bRef} className = "ms-1" type = "text" placeholder = "Max"/>
                            <button onClick = {customPrice} className = "ms-1 border 0">Szukaj</button>
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