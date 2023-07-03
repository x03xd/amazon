import card_picture from './images/cardz.svg';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext} from 'react';
import CardObject from './CardObject';
import AuthContext from "./AuthenticationContext";
import CSRFToken from './CSRFToken';
import jwt_decode from "jwt-decode";
import CardFinalizing from './CardFinalizing';
import CartSideBar from './CartSideBar'
import { setUncaughtExceptionCaptureCallback } from 'process';


interface Product {
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




const Card: React.FC = () => {

    const [cardUserGetter, setCardUserGetter] = useState<number[]>([]);
    const [cardItemsGetter, setCardItemsGetter] = useState<Product[] | []>([]);

    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate()

    let {username, authToken} = useContext(AuthContext);


    useEffect(() => {
        if(authToken == null) navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }, [])

    

    useEffect(() => {
        try{
            fetch('http://127.0.0.1:8000/api/cart/', {
                method: 'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"username": username?.username})
            })
            .then(response => response.json())
            .then(result => (setCardUserGetter(result)));
        }

        catch(error){
            console.log("Error: ", error)
        }

    }, [])

    //console.log(cardItemsGetter)

    useEffect(() => {
        try{
            //const response
            fetch('http://127.0.0.1:8000/api/products/', {
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"list": cardUserGetter})
            })
            .then(response => response.json())
            .then(result => (setCardItemsGetter(result)));
        }

        catch(error){
            console.log("Error: ", error)
        }

    }, [cardUserGetter])

    //let prev: number = 0;

    useEffect(() => {
        let prevValue : number = 0;
        cardItemsGetter.map(item => prevValue += item.price)
        setTotal(prevValue)

    }, [cardItemsGetter])
    
    /*
    if (authToken === null) {
        window.location.href = '/login';
        return null; // You can return null or any other placeholder while the redirection happens
    }
    */
    


    const removeProduct = (num : number) => {
        setCardUserGetter(prevItems => prevItems.filter(item => item !== num));
        //if(cardUserGetter.length <= 1) window.location.reload();
    }



    if(cardItemsGetter.length === 0){
        return(
            <div className = "card-content mt-5">
            <CSRFToken />
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
                    <CartSideBar />  
                </div>

            </div>
        );
    }

    else {

        return(

             <div className = "card-content mt-5">

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
                            {cardItemsGetter.map((item, index : number) => {
                                return(
                                    <CardObject item = {item} key = {index} index = {cardUserGetter[index]} ajaxFunction = {removeProduct} />
                                )    
                            })}
                        </div>


                        <div className = "card-content-objects-footer">

                        </div>
                    </div>


                    <div className = "card-content-left-second bg-light">

                    </div>
                </div>

                <div className = "card-content-right">
                    <CardFinalizing num = {cardUserGetter.length} total = {total} />

                    <CartSideBar />              
                </div>

            </div>

        );
    }
}
export default Card;