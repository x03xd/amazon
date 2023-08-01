import React, { useState, useEffect, useRef, useContext } from 'react';
import ProductCard from './ProductCard';
import UList from './UList';
import Clear from './Clear';
import Rating from './Rating';
import Checkbox from './Checkbox';
import QueryParamsContext from "./QueryParamsContext";
import {priceLimits} from './static_ts_files/priceLimits'

interface Products {
    brand: string;
    description: string;
    id: number;
    image: string;
    price: number;
    quantity: number;
    category_name: number;
    title: string;
}

interface Categories {
    id: number;
    name : string;
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

interface Brands {
    id: number,
    brand_name: string,
    belong_to_category: number
}


const Store: React.FC = () => {
    
        const searchParams = new URLSearchParams(window.location.search);

        const [productsWithRatings, setProductsWithRatings] = useState<JSX.Element[]>([]);
        const [products, setProducts] = useState<Products[]>([]);

        const [prices, setPrices] = useState<PriceLimits[]>([]);
        const [categories, setCategories] = useState<Categories[]>([]);
        const [brands, setBrands] = useState<Brands[]>([]);
        const [averageRate, setAverageRate] = useState<Rate[]>([]);

        const aRef = useRef<HTMLInputElement>(null);
        const bRef = useRef<HTMLInputElement>(null);

        const [pricesFalseFilled, setPricesFalseFilled] = useState<boolean[]>([]);
        const [brandsFalseFilled, setBrandsFalseFilled] = useState<boolean[]>([]);

        const {q_QueryParam} = useContext(QueryParamsContext);
        const url = window.location.href;

        const index = url.indexOf('http://localhost:3000/s');
        const queryLinkPart = url.substring(index + 'http://localhost:3000/s'.length);

        useEffect(() => {
            
            try {
                fetch(`http://127.0.0.1:8000/api/categories/`)
                .then(response => response.json())
                .then(result => setCategories(result));

                fetch(`http://127.0.0.1:8000/api/brands/${q_QueryParam}`)
                .then(response => response.json())
                .then(result => setBrands(result));

                fetch(`http://127.0.0.1:8000/api/avg-rate`)
                .then(response => response.json())
                .then(result => setAverageRate(result));

                fetch(`http://127.0.0.1:8000/api/products/${queryLinkPart}`)
                .then(response => response.json())
                .then(result => (setProducts(result)));
            }
            catch(error){alert('An error occurred. Please try again later.');}

            for(let nums of priceLimits){
                setPrices(prev => [...prev, nums]);
            }   
   
        }, [])

        useEffect(() => {
            for(let i: number = 0; i <= [...new Set(prices)].length - 1; i++){
                setPricesFalseFilled(ar2 => [...ar2, false])
            }
        }, [prices])    
    

        useEffect(() => {        
            for(let i: number = 0; i <= [...new Set(brands)].length - 1; i++){
                setBrandsFalseFilled(ar2 => [...ar2, false])
            }
        }, [brands])     
        
        function clearQueryString(arg: string){

            switch (arg) {
                case "c":

                    brands.map((item: Brands, index: number) => {

                        let storage = JSON.parse(localStorage.getItem("c" + index) || "");
                        let checkStorage = storage ? storage.value : "";

                        if(checkStorage){
                            const object = {value: false, nut: "c", id: (item["brand_name"] || []) }
                            localStorage.setItem("c" + index, JSON.stringify(object));
                        }
                    
                        return null;
                    })
                    break;

                case "u":
                    prices.map((item: PriceLimits, index: number) => {

                        const storage = JSON.parse(localStorage.getItem("u" + index) || "");
                        const checkStorage = storage ? storage.value : "";

                        if(checkStorage){
                            const object = {value: false, nut: "u", id: (prices || [])[index] }
                            localStorage.setItem("u" + index, JSON.stringify(object));
                        }
                        
                        return null;
                    })
                    break;


                case "rating":
         
                    const storage = JSON.parse(localStorage.getItem("rating") || "");
                    const checkStorage = storage ? storage.value : "";

                    if(checkStorage){
                        const object = {value: false, num: 0};
                        localStorage.setItem("rating", JSON.stringify(object));
                    }
                        
                    return null;

            }

            window.location.reload();
        }

        function isOnlyNumber(str: string) {
            return /^[0-9]+$/.test(str);
        }

        function customPrice(): void {
            const minVal: string = aRef.current?.value || "";
            const maxVal: string = bRef.current?.value || "";

            if(!isOnlyNumber(minVal)) alert("Only positive integers accepted at min input");
            if(!isOnlyNumber(maxVal)) alert("Only positive integers accepted at max input");

            else if(parseFloat(minVal) > parseFloat(maxVal)) alert("The value of min input must be lower than the value of max input")

            else{
                searchParams.set('u', `${aRef.current?.value}-${bRef.current?.value}`);
                const modifiedQueryString = searchParams.toString();
                const baseUrl = window.location.href.split('?')[0];
                const updatedUrl = baseUrl + '?' + modifiedQueryString;
                window.location.href = updatedUrl;       
            }

        }

        function changeQ(qValue: string): void {
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
                        <Clear text = "Wyczyść" nut = "q" func = {clearQueryString}  />
                        <ul>
                            {categories.map((item, index) => <UList index = {index} UListFunction = {changeQ} key = {index} item = {item["name"]} /> )}
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
                            {brands.map((item, index: number) => {
                                return(
                                    <Checkbox booleanArray = {brandsFalseFilled} nut = "c" index = {index} key = {index + "c"} name = {item["brand_name"]} arrayProp = {[...new Set(brands)]} />
                                )
                            })}
                        </ul>
                    </div>


                    <div>
                        <span>Cena</span>
                        <Clear text = "Wyczyść" nut = "u" func = {clearQueryString} />
                        <ul className = "checkbox-list">
                            {priceLimits.map((item, index: number) => {
                                return(
                                    <Checkbox booleanArray = {pricesFalseFilled} nut = "u" index = {index} key = {index + "u"} name = {item.item.desc} arrayProp = {[...new Set(prices)]} />
                                )
                            })}
                        </ul>
                    </div>

                    <div className = "d-flex align-items-center price-filters">
                        <input ref = {aRef} className = "" type="number" placeholder = "Min" step="1" />
                        <input ref = {bRef} className = "ms-1" type="number" placeholder = "Max" step="1" />
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