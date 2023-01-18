import Banner from './Banner';
import { useState, useEffect, useRef, useContext } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from "react-router-dom";
import UList from './UList';
import Clear from './Clear';
import Rating from './Rating';
import Checkbox from './Checkbox';
import React from 'react';
import QueryParamsContext from "./QueryParamsContext";

export default function Store(props){

    const navigate = useNavigate();

    //   {priceLimits.map((item, index) => <Checkbox query = {searchParams.get("q")} index = {index} key = {index} name = {item} array = {newArray} /> )}

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [subs, setSubs] = useState([]);
    const [forData, setForData] = useState([]);
    const [averageRate, setAverageRate] = useState([]);

    const aRef = useRef();
    const bRef = useRef();
    const cRef = useRef();

    let {q_QueryParam, c_QueryParam, u_QueryParam, u2_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);


    useEffect(() => {

        fetch(`http://127.0.0.1:8000/api/subcategories/`)
        .then(response => response.json())
        .then(result => setSubs(result));

        fetch(`http://127.0.0.1:8000/api/categories/`)
        .then(response2 => response2.json())
        .then(result2 => setCategories(result2));

        fetch(`http://127.0.0.1:8000/api/products/?q=${q_QueryParam}&c=${c_QueryParam}&u=${u_QueryParam}&rating=${rating_QueryParam}`)
        .then(response3 => response3.json())
        .then(result3 => (console.log(result3), setProducts(result3)));

        fetch(`http://127.0.0.1:8000/api/products-by-subs/?q=${q_QueryParam}`)
        .then(response4 => response4.json())
        .then(result4 => setForData(result4));

        fetch(`http://127.0.0.1:8000/api/avg-rate`)
        .then(response5 => response5.json())
        .then(result5 => (console.log(result5), setAverageRate(result5)));

        fetch(`http://127.0.0.1:8000/api/test`)
        .then(response6 => response6.json())
        .then(result6 => console.log(result6));

    },[])


        let priceLimits = [
            {item: {desc: "Do 20zł", range: {start: 1, end: 20}}},
            {item: {desc: "20 do 50zł", range: {start: 20.01, end: 50}}},
            {item: {desc: "50 do 100zł", range: {start: 50.01, end: 100}}},
            {item: {desc: "100 do 150zł", range: {start: 100.01, end: 150}}},
            {item: {desc: "150zł i więcej", range: {start: 150.01, end: 99999}}},
        ]


        let arrayBrands = [];
        for(let product of forData){
            arrayBrands.push(product.brand)
        }
        let uniqueArrayBrands = [...new Set(arrayBrands)];
        let brandsFalseFilled = [...new Set(arrayBrands)];

        brandsFalseFilled.fill(false)


        let arrayPrices = [];
        for(let nums of priceLimits){
            arrayPrices.push(nums)
        }
        let uniqueArrayPrices = [...new Set(arrayPrices)];
        let pricesFalseFilled = [...new Set(arrayPrices)];

        pricesFalseFilled.fill(false)


        function clearQueryString(arg){

            switch (arg) {
                case "c":
                    //console.log(storage);
                    //console.log(checkStorage);

                    arrayBrands.map((item, index) => {

                        let storage = JSON.parse(localStorage.getItem("c" + index));
                        let checkStorage = storage ? storage.value : "";

                        if(checkStorage === true){
                            let object = {value: false, nut: "c", id: (uniqueArrayBrands || [])[index] }
                            localStorage.setItem("c" + index, JSON.stringify(object));
                        }

                    })
                    break;

                case "u":
                    arrayPrices.map((item, index) => {

                        let storage = JSON.parse(localStorage.getItem("u" + index));
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
            navigate(`?q=${q_QueryParam}&c=${c_QueryParam}&u=${aRef.current.value}-${bRef.current.value}&rating=${rating_QueryParam}`);

            window.location.reload();
        }


        function changeQ(qValue){
            navigate(`?q=${qValue.toLowerCase()}&c=${c_QueryParam}&u=${u_QueryParam}`);
            window.location.reload();
        }


        let productsWithRatings = [];

        aLoop:
        for(let item of products){
            for(let rate of averageRate){

                if(Number(rate.rated_products) === item.id){

                    productsWithRatings.push(<ProductCard key = {item.id} item = {item} rate = {rate.average_rate} />);

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
                            {subs.map((item, index) => <UList UListFunction = {changeQ} key = {index} item = {item.sub_category} /> )}
                        </ul>
                     </div>

                    <div>
                        <span>Recenzja klienta</span>
                        <Rating />
                    </div>


                    <div>
                        <span>Marka</span><br/>
                        <Clear nut = "c" func = {clearQueryString} arrayProp = {uniqueArrayBrands} />
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
                        <Clear nut = "u" func = {clearQueryString} arrayProp = {uniqueArrayPrices} />
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

