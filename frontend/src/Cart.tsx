import card_picture from './images/cardz.svg';
import React, { useState, useEffect, useContext} from 'react';
import CardObject from './CartObject';
import AuthContext from "./AuthenticationContext";
import CardFinalizing from './CartFinalizing';
import CartSideBar from './CartSideBar'
import { useNavigate } from 'react-router-dom';
import { ProductsInterface } from './static_ts_files/commonInterfaces';
import Recommendations from './Recommendations';

interface CartItem {
    id: number;
    quantity: number;
    cart: number;
    product: number;
    total_price: number;
    product_data: ProductsInterface;
}

interface HashMap {
    [key: string]: any;
}

const Card: React.FC = () => {

    const [cardUserGetter, setCardUserGetter] = useState<CartItem[]>([]);
    const [cardUserGetterID, setCardUserGetterID] = useState<number[]>([]);
    const [reload, setReload] = useState<[number, number]>();
    const [isPossible, setIsPossible] = useState<HashMap>([]);
    const [total, setTotal] = useState<number>(0);

    const {username} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/cart/${username?.user_id}`)
            .then(response => response.json())
            .then(result => (setCardUserGetter(result?.cart_items || []), setTotal(result?.sum || 0), setCardUserGetterID(result?.serialized_id)));
        }
        catch(error){alert('An error occurred. Please try again later.');}
    }, [reload])

    const removeProduct = (num: number) => {
        setCardUserGetter(prevItems => prevItems.filter(item => item.product !== num));
    }
    
    const navigateToLogin = () => {
        navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }

    const navigateToRegister = () => {
        navigate("/registration/")
    }

    const prev = (val: number, num: number) => {
        setReload([val, num])
    }

    const isPossibleCheck = (val: number) => {
        setIsPossible(prevHashmap => ({ ...prevHashmap, [val]: false }))
    }

    const removeIsPossibleCheck = (val: number) => {
        delete isPossible[val]
    }

    if(cardUserGetter && cardUserGetter.length === 0){
        return(
            <div className = "card-content mt-5">
                <div className = "card-content-left">
                    <div className = "card-content-left-first bg-light">
                        <div className = "card-content-left-first-img">
                            <img width = "350" src = {card_picture} loading = "lazy" alt = "" />
                        </div>

                        <div className = "card-content-left-first-content">
                            <span className = "fs-25 fw-500">Twój koszyk jest pusty</span> <br/>
                            <a href = "#">Kup dzisiejsze oferty</a>

                            <div className = "mt-3">
                                <input onClick = {navigateToLogin} value = "Zaloguj się na swoje konto" className = "bg-warning border rounded p-1 fs-16" type = "button"/>
                                <input onClick = {navigateToRegister} value = "Zarejestruj się teraz" className = "border rounded p-1 fs-16 ms-3" type = "button"/>
                            </div>
                        </div>
                    </div>

                    <div className = "card-content-left-second bg-light"> 
                    </div>
                    
                    <p className = "fs-11">Ceny i dostępność produktów w serwisie Amazon.pl mogą ulec zmianie. Produkty sa tymsaczowo przechowywane w koszyku. Wyświetlone w tym miescu cena są zawsze aktualne. <br/> Chesz Chcwsz zrealizować kod z karty podarunkowej lub kod promocyjny? Wpisz kod podusmowując zamówienie</p>
                </div>

                <div className = "card-content-right bg-light">
                    <CartSideBar />  
                </div>

            </div>
        );
    }

    else{
        return(
            <div className = "card-content mt-5">
                <div className = "card-content-left">
                    <div className = "card-content-objects bg-light shadow">
                        <div>
                            <div className = "p-4 ms-3">
                                <p className = "ms-4">Koszyk</p>
                            </div>

                            <div className = "d-flex justify-content-center">
                                <div className = "line-separator bg-secondary"></div>
                            </div>
                        </div>
             
                        <div className = "card-content-objects-inner mt-5 bg-light">
                            {
                                (cardUserGetter as CartItem[] || []).map((item: CartItem, index: number) => {
                                    return(
                                        <CardObject
                                            item = {item} key = {index}
                                            ajaxFunction = {removeProduct}
                                            prev = {prev}
                                            isPossibleCheck = {isPossibleCheck}
                                            removeIsPossibleCheck = {removeIsPossibleCheck}
                                        />
                                    )    
                                })
                            }
                        </div>

                        <div className = "card-content-objects-footer">
                        </div>
                    </div>

                    <div className = "card-content-left-second bg-light shadow">
                    </div>
                </div>

                <div className = "card-content-right">
                    <CardFinalizing num = {cardUserGetter.length} total = {total} buyButton = {isPossible} />
                    <CartSideBar />              
                </div>

                <div className = "recommendation-bar">
                    <Recommendations products_id = {cardUserGetterID} />
                </div>
            
            </div>

        );
    }
}
export default Card;