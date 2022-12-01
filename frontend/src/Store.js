import Banner from './Banner';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useOutletContext, useSearchParams } from "react-router-dom";
import UList from './UList';
import Checkbox from './Checkbox';

export default function Store(props){

        function getCookie(name) {
        let cookieValue = null;

        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();

                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                    break;
                }
            }
        }
        return cookieValue;
    }

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [subs, setSubs] = useState([]);
    const [forData, setForData] = useState([]);

    console.log(products)

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/api/subcategories/`)
        .then(response => response.json())
        .then(result => setSubs(result));


        fetch(`http://127.0.0.1:8000/api/categories/`)
        .then(response2 => response2.json())
        .then(result2 => setCategories(result2));


        fetch(`http://127.0.0.1:8000/api/products/?q=${searchParams.get("q")}&c=${searchParams.get("c")}`)
        .then(response3 => response3.json())
        .then(result3 => setProducts(result3));


        ///FOR DATA///

        fetch(`http://127.0.0.1:8000/api/products/`)
        .then(response4 => response4.json())
        .then(result4 => setForData(result4));

    },[])

    console.log(searchParams.get("c"));


    // ,[] This array defines the list of variables that if changed will trigger the callback function.
    // tu byla historia plus wczesniej outlet podanie contextu


        let priceLimits = [
            "Do 20zł", "20 do 50zł", "50 do 100zł", "100 do 150zł", "150zł i więcej"
        ]


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
                            {subs.map((item, index) => <UList key = {index} item = {item.sub_category} /> )}
                        </ul>
                     </div>

                    <div>
                        <span>Marka</span>
                        <ul>
                            {forData.map((item, index) => <Checkbox query = {searchParams.get("q")} key = {index} item = {item.brand} /> )}
                        </ul>
                    </div>

                    <div>
                        <span>Cena</span>
                        <ul>
                            {priceLimits.map((item, index) => <Checkbox query = {searchParams.get("q")} key = {index} item = {item} /> )}
                        </ul>
                    </div>

                </div>


                <div className = "store-content-products">
                    <div className = "">
                        <span className = "fs-20 fw-525">WYNIKI</span><br/>
                        <a className = "fs-14 text-decoration-none">Dowiedz się o tych wynikach.</a>
                    </div>

                    <div className = "store-content-results mt-3">
                        {products.map((item, index) => <ProductCard key = {index} item = {item} />)}
                    </div>
                </div>

                <div></div>

            </div>
        );
}