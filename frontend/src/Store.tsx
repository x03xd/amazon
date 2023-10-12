import React, { useState, useEffect, useRef, useContext } from 'react';
import UList from './UList';
import Clear from './Clear';
import Rating from './Rating';
import Checkbox from './Checkbox';
import QueryParamsContext from "./QueryParamsContext";
import {priceLimits} from './static_ts_files/priceLimits'
import ProductsWithRatings from './ProductsWithRatings'
import {ProductsInterface, Categories, PriceLimits, Brands, UserInterface} from './static_ts_files/commonInterfaces';
import AuthContext from "./AuthenticationContext";
import {customPrice, changeQ, clearQueryString} from './static_ts_files/storeUtils';


const Store: React.FC = () => {

    const [prices, setPrices] = useState<PriceLimits[]>([]);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [brands, setBrands] = useState<Brands[]>([]);
    //const [user, setUser] = useState<UserInterface | null>(null);
    const [products, setProducts] = useState<ProductsInterface[]>([]);

    const aRef = useRef<HTMLInputElement>(null);
    const bRef = useRef<HTMLInputElement>(null);

    const [pricesFalseFilled, setPricesFalseFilled] = useState(() =>
        Array.from({ length: [...new Set(prices)].length }, () => false)
    );

    const [brandsFalseFilled, setBrandsFalseFilled] = useState(() =>
        Array.from({ length: [...new Set(brands)].length }, () => false)
    );

    const {fetchUserData} = useContext(AuthContext);
    const {q_QueryParam} = useContext(QueryParamsContext);

    const url = window.location.href;
    const index = url.indexOf('http://localhost:3000/s');
    const queryLinkPart = url.substring(index + 'http://localhost:3000/s'.length);

    useEffect(() => {
        const fetchData = async () =>{

            try {
                const userData: any = await fetchUserData();

                const userId = userData?.data?.id
                const userCurrency = userData?.data?.currency

                fetch(`http://127.0.0.1:8000/api/categories/`)
                .then(response => response.json())
                .then(result => setCategories(result));
    
                fetch(`http://127.0.0.1:8000/api/brands/category/${q_QueryParam}`)
                .then(response => response.json())
                .then(result => setBrands(result));

                fetch(`http://127.0.0.1:8000/api/products/${userId}/${userCurrency}/${queryLinkPart}`)
                .then(response => response.json())
                .then(result => setProducts(result));
                
                for (let nums of priceLimits) {
                    setPrices(prev => [...prev, nums]);
                }
              
            }

            catch (error) {
                console.error('An error occurred:', error);
            }
        };
      
        fetchData();
    }, []);

    return(
        <div className = "store-content mt-5">

            <div className = "store-content-bar">

                <div className = "pt-0">
                    <span>Możliwość darmowej dostawy</span> <br/>
                    <input type = "checkbox" /> <a href = "#" className = ""> Darmowa wysyłka przez Amazon <br/>
                    Darmowa dostawa dla wszystkich klientów <br/> przy zamówieniach o wartosci powyżej 40 zł, wysyłanych przez Amazon</a>
                </div>

                <div>
                    <span>Kategoria</span>
                    <Clear text = "Wyczyść" nut = "q" func = {() => {clearQueryString("q", brands, prices)}}  />
                    <ul>
                        {categories.map((item) => (
                            <UList
                                key={item.id} 
                                item={item.name}
                                index={item.id} 
                                UListFunction={changeQ}
                            />
                        ))}
                    </ul>
                </div>

                <div>
                    <span>Recenzja klienta</span>
                    <Clear text = "Wyczyść" nut = "rating" func = {() => {clearQueryString("rating", brands, prices)}}  />
                    <Rating />
                </div>

                <div>
                    <span>Marka</span><br/>
                    <Clear text = "Wyczyść" nut = "c" func = {() => {clearQueryString("c", brands, prices)}}  />
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
                    <Clear text = "Wyczyść" nut = "u" func = {() => {clearQueryString("u", brands, prices)}} />
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
                    <button onClick = {() => {customPrice(aRef.current?.value, bRef.current?.value)}} className = "ms-1 border 0">Szukaj</button>
                </div>

            </div>

            <div className = "store-content-products">
                <div className = "">
                    <span className = "fw-525">WYNIKI</span><br/>
                    <a href = "#" className = "text-decoration-none">Dowiedz się o tych wynikach.</a>
                </div>

                <div className = "store-content-results mt-3">
                    <ProductsWithRatings products={products} />
                </div>  
            </div>
                        
            <div></div>
        </div>
        );

}
export default Store;