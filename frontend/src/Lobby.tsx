import {useState, useEffect, useContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import adress from './images/loc1.png';
import padlock2 from './images/padlock2.png';
import AuthContext from "./AuthenticationContext";
import React from 'react';
import getCookie from './getCookie'
import Recommendations from './Recommendations';
import Opinions from './Opinions';

const Lobby: React.FC = () => {
    const [selectedValue, setSelectedValue] = useState<number>(1);
    const [brand, setBrand] = useState<string>("");
    const [modPrice, setModPrice] = useState<number>(0);
    const {username} = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/brand/${location.state.brand}`)
            .then(response => response.json())
            .then(result => setBrand(result?.brand_name))

            fetch(`http://127.0.0.1:8000/api/lobby-price-mod/${username?.user_id}/${location.state.id_product}`)
            .then(response => response.json())
            .then(result => setModPrice(result?.modified_price))
        }
        catch(error){alert(error);}
    }, [])

    useEffect(() => {
    }, [selectedValue])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(parseInt(e.target.value, 10));
    };

    window.addEventListener('popstate', function(e: PopStateEvent) {
        navigate("/s");
    });

    const finalizeOrderLobby = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/finalize-order/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"location": "lobby", "product_id": [location.state.id_product], "quantity": selectedValue, "user": username?.user_id})
            })
            const responseJSON = await response.json()

            if(responseJSON?.status) alert(`Pomyślnie kupiono ${location.state.title}`)
            else alert(responseJSON)
        }

        catch(error){alert('An error occurred. Please try again later.');}
    }

    async function addToCard(e: React.MouseEvent<HTMLInputElement>){
        e.preventDefault();

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/process/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'product_id': location.state.id_product, 'user_id': username?.user_id, "quantity": selectedValue})
            });
            const responseJSON = await response.json();

            if(responseJSON?.status) alert("Produkt pomyślnie dodano do koszyka");
            else alert(responseJSON)

        }
        catch(error){alert('An error occurred. Please try again later.');}
    }

    return(
        <div className = "lobby-content">

            <div className = "lobby-content-gallery mt-5">
                <div>
                    <img src = {location.state?.image} alt = "product" loading = "lazy" className = "p-5" height = "450" width = "600" />
                </div>

                <div className = "mt-5">
                    <span className = "mt-p-5">{location.state?.desc}</span> <br/>
                    <span>Marka: {brand}</span>
                </div>
            </div>

            <div className = "mt-5">
                <div className = "lobby-content-sidebar">

                    <div className = "">
                        <span>
                            {modPrice !== 0 ? (
                                `${modPrice * selectedValue} ${getCookie("currency") ? getCookie("currency") : "USD"}`
                            ) : (
                                null
                            )}
                        </span><br />
                    </div>

                    <div>
                        <a href = "#" className = "fw-550">DARMOWA dostawa </a> <br/>
                    </div>

                    <div>
                        <span className = "">Lub najszybsza dostawa</span>
                    </div>

                    <div className = "d-flex align-items-center">
                        <img src = {adress} alt = "address" loading = "lazy" /> <a href = "#" className = "">Wybierz adres dostawy</a>
                    </div>

                    <div className = "d-flex align-items-center">
                        <label className = "" htmlFor = "quantity">Ilość: </label>

                        <select className = "ms-2 p-2" name="quantity" id="quantity" value={selectedValue} onChange={handleSelectChange}>
                            <option value= "1" >1</option>
                            <option value= "2" >2</option>
                            <option value= "3" >3</option>
                            <option value= "4" >4</option>
                            <option value= "5" >5</option>
                            <option value= "6" >6</option>
                            <option value= "7" >7</option>
                            <option value= "8" >8</option>
                            <option value= "9" >9</option>
                            <option value= "10" >10</option>
                        </select>
                    </div>

                    <div className = "lobby-buttons">
                        <form method = "POST">
                            <input onClick = {addToCard} type = "button" id = "add-to-card-button" value = "Dodaj do koszyka"/>
                        </form>

                        <form method = "POST">
                            {selectedValue <= location.state?.quantity
                                ?
                                <input onClick = {() => finalizeOrderLobby()} className = "bg-warning" type = "button" id = "buy-now-button" value = "Kup teraz" />
                                :
                                <input disabled type = "button" className = "bg-danger" id = "buy-now-button" value = "Nie mamy takiej ilości produktu" />
                            }
                        </form>
                    </div>

                    <div className = "d-flex align-items-center">
                        <img src = {padlock2} alt = "padlock" loading = "lazy"/>
                        <a href = "#" className = "ms-1">Bezpieczna transakcja</a>
                    </div>

                    <div>
                        <span>Wysyłka i sprzedaż przez Amazon.</span>
                    </div>

                    <div>
                        <span>Zasady dotyczące zwrotów:</span> <br/>
                        <a href = "#">Możliwość zwrotu do 31 stycznia 2023</a>
                    </div>

                </div>
            </div>
            
            {username?.user_id !== undefined
                ?
                    <div className = "opinions-bar">
                        <Opinions product_id = {location.state.id_product} user_id = {username?.user_id} />
                    </div>
                :
                <></>
            }

            <div className = "recommendation-bar">
                <Recommendations products_id = {[location.state.id_product.toString()]} />
            </div>
        </div>
    );

}

export default Lobby;