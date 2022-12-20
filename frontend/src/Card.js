import card_picture from './images/cardz.svg';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import CardObject from './CardObject';


export default function Card(){

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



    const [cardItemsGetter, setCardItemsGetter] = useState([]);
    const [cardItemsSetter, setCardItemsSetter] = useState([]);
    const [userID, setUserID] = useState([""]);


    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/cart/`)
        .then(response => response.json())
        .then(result => (setCardItemsGetter(result)));
    }, [])


    console.log(cardItemsGetter);

    useEffect(() => {
        let response = fetch("http://127.0.0.1:8000/api/products/", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },

            body: JSON.stringify({
                "list" : cardItemsGetter
            })

        })
        .then(response => response.json())
        .then(result => setCardItemsSetter(result))

    }, [cardItemsGetter])



    if(!cardItemsGetter){
        return(
            <div className = "card-content mt-5 bg-white">

                <div className = "card-content-left">
                    <div className = "card-content-left-first bg-light">
                        <div className = "card-content-left-first-img">
                            <img width = "350" src = {card_picture} />
                        </div>

                        <div className = "card-content-left-first-content">
                            <span className = "fs-25 fw-500">Twój koszyk jest pusty</span> <br/>
                            <a href = "">Kup dzisiejsze oferty</a>

                            <div className = "mt-3">
                                <input value = "Zaloguj się na swoje konto" className = "bg-warning border rounded p-1 fs-16" type = "button"/>
                                <input value = "Zarejestruj się teraz" className = "border rounded p-1 fs-16 ms-3" type = "button"/>
                            </div>
                        </div>
                    </div>

                    <div className = "card-content-left-second bg-light">

                    </div>

                    <p className = "fs-11">Ceny i dostępność produktów w serwisie Amazon.pl mogą ulec zmianie. Produ,kty sa tymsaczowo przechowywane w koszyku. Wyświetlone w tym miescu cena są zawsze aktualne. <br/> Chesz Chcwsz zrealizować kod z karty podarunkowej lub kod promocyjny? Wpisz kod podusmowując zamówienie</p>
                </div>




                <div className = "card-content-right bg-light">
                    SIDEBAR
                </div>

            </div>
        );
    }

    else if(cardItemsGetter){

        return(

             <div className = "card-content mt-5 bg-white">

                <div className = "card-content-left">

                    <div className = "card-content-objects bg-light">
                        <div>
                            <div className = "p-4">
                                <p className = "">Koszyk</p>

                            </div>

                            <div className = "d-flex justify-content-center">
                                <div className = "line-separator bg-secondary"></div>
                            </div>
                        </div>

                        <div className = "card-content-objects-inner mt-5 bg-light">
                            {cardItemsSetter.map(item => <CardObject item = {item} /> )}
                        </div>


                        <div className = "card-content-objects-footer">

                        </div>
                    </div>


                    <div className = "card-content-left-second bg-light">

                    </div>
                </div>

                <div className = "card-content-right bg-light">
                    SIDEBAR
                </div>

            </div>

        );

    }

}