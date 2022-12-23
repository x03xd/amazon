import Banner from './Banner';
import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import UList from './UList';
import Clear from './Clear';
import CSRFToken from './CSRFToken';

import Checkbox from './Checkbox';


export default function Store(props){

    const navigate = useNavigate();

    //   {priceLimits.map((item, index) => <Checkbox query = {searchParams.get("q")} index = {index} key = {index} name = {item} array = {newArray} /> )}


    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [subs, setSubs] = useState([]);
    const [forData, setForData] = useState([]);

    const aRef = useRef();
    const bRef = useRef();
    const cRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
        const c = searchParams.get("c");
        const q = searchParams.get("q");
        const u = searchParams.get("u");
        const u2 = searchParams.get("u2");


    useEffect(() => {

        fetch(`http://127.0.0.1:8000/api/subcategories/`)
        .then(response => response.json())
        .then(result => setSubs(result));


        fetch(`http://127.0.0.1:8000/api/categories/`)
        .then(response2 => response2.json())
        .then(result2 => setCategories(result2));


        fetch(`http://127.0.0.1:8000/api/products/?q=${searchParams.get("q")}&c=${searchParams.get("c")}&u=${searchParams.get("u")}&u2=${searchParams.get("u2")}`)
        .then(response3 => response3.json())
        .then(result3 => setProducts(result3));

        fetch(`http://127.0.0.1:8000/api/products-by-subs/?q=${searchParams.get("q")}`)
        .then(response4 => response4.json())
        .then(result4 => setForData(result4));

    },[])

    //console.log(searchParams.get("c"));


        // zrob oddzoelny file i dla kazdej subkaty daj inne progi

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
        let unique = [...new Set(arrayBrands)];
        let unique2 = [...new Set(arrayBrands)];

        unique2.fill(false)



        let arrayPrices = [];
        for(let nums of priceLimits){
            arrayPrices.push(nums)
        }
        arrayPrices.fill(false)


        function clearQueryString(arg){
            switch (arg) {
                case "c":
                    arrayBrands.map((item, index) => {

                        if(localStorage.getItem("c" + index) == "true"){
                            localStorage.setItem("c" + index, "false");
                        }

                    })
                    break;

                case "u":
                    arrayPrices.map((item, index) => {

                        if(localStorage.getItem("u" + index) == "true"){
                            localStorage.setItem("u" + index, "false");
                        }

                    })
                    break;
            }
            window.location.reload();
        }


        function handleClickSearch(){

            console.log(aRef.current.value);

            navigate(`?q=${q}&c=${c}&u=${aRef.current.value}&u2=${bRef.current.value}`);
            window.location.reload();
        }


        function changeQ(qValue){
            navigate(`?q=${qValue.toLowerCase()}&c=${c}&u=${u}&u2=${u2}`);
            window.location.reload();
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
                        <span>Marka</span><br/>
                        <Clear nut = "c" func = {clearQueryString} />
                        <ul className = "checkbox-list">
                            {unique.map((item, index) =>
                                <Checkbox nut = "c" c = {item} u = {searchParams.get("u")} u2 = {searchParams.get("u2")} index = {index} key = {index} name = {item} array = {unique2} />
                            )}
                        </ul>
                    </div>

                    <div>
                        <span>Cena</span>
                        <Clear nut = "u" func = {clearQueryString} />
                        <ul className = "checkbox-list">
                            {priceLimits.map((item, index) =>
                                <Checkbox nut = "u" c = {searchParams.get("c")} u = {item.item.range.start} u2 = {item.item.range.end} index = {index} key = {index} name = {item.item.desc} array = {arrayPrices} /> )
                            }
                        </ul>

                        <div className = "d-flex align-items-center price-filters">
                            <input ref = {aRef} className = "" type = "text" placeholder = "Min"/>
                            <input ref = {bRef} className = "ms-1" type = "text" placeholder = "Max"/>
                            <button onClick = {handleClickSearch} className = "ms-1 border 0">Szukaj</button>
                        </div>
                    </div>

                </div>


                <div className = "store-content-products">
                    <div className = "">
                        <span className = "fw-525">WYNIKI</span><br/>
                        <a className = "text-decoration-none">Dowiedz się o tych wynikach.</a>
                    </div>

                    <div className = "store-content-results mt-3">
                        {products.map((item, index) => <ProductCard key = {index} item = {item} />)}
                    </div>
                </div>

                <div></div>

            </div>
        );
}