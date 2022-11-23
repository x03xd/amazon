import Banner from './Banner';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useOutletContext } from "react-router-dom";


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

    const [data, setData] = useState([]);

    console.log(data);

    let xd = window.location.href.substring(26, 100);
    console.log(xd);

    useEffect(() => {
        let response = fetch(`http://127.0.0.1:8000/api/products/?q=${xd}`)
        .then(response => response.json())
        .then(result => (setData(result), console.log(result)));
    },[])

    // ,[] This array defines the list of variables that if changed will trigger the callback function.
    // tu byla historia plus wczesniej outlet podanie contextu


        return(
            <div className = "store-content">

                <div className = "store-content-bar">

                    <div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <div>
                        <span>Recenzja klienta</span>
                    </div>

                    <div>
                        <span>Cena</span>

                        <input type = "checkbox"/>
                        <input type = "checkbox"/>
                        <input type = "checkbox"/>
                        <input type = "checkbox"/>
                        <input type = "checkbox"/>
                    </div>

                </div>

                <div className = "store-content-products">
                    <div className = "pt-4">
                        <span className = "fs-19">WYNIKI</span><br/>
                        <a>Dowiedz się o tych wynikach.</a>
                    </div>


                    <div className = "store-content-results">
                        {data.map((item, index) => <ProductCard key = {index} item = {item} />)}
                    </div>
                </div>

                <div></div>

            </div>
        );
}