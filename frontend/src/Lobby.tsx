import { useState, useEffect, useContext } from 'react';
import {useLocation} from 'react-router-dom';
import adress from './images/loc1.png';
import padlock2 from './images/padlock2.png';
import CSRFToken from './CSRFToken';
import AuthContext from "./AuthenticationContext";
import React from 'react';

const Lobby: React.FC = () => {

    const [selectedValue, setSelectedValue] = useState<number>(1);
    let {username} = useContext(AuthContext)
    const [brand, setBrand] = useState<string>("");
    const location = useLocation();


    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/brand/${location.state.brand}`)
        .then(response => response.json())
        .then(result => setBrand(result?.brand_name))
    }, [])

    useEffect(() => {
    }, [selectedValue])

    const handleSelectChange = (e: any) => {
        setSelectedValue(parseInt(e.target.value, 10))
    };

    let status = location.state.status
    let statusColor;

    if(status <= 0){
        status = "Niedostępny"
        statusColor = "text-danger";
    }

    else {
        status = "Dostępny"
        statusColor = "text-success";
    }


    const finalizeOrderLobby = async (product_id: number) => {
        try{
            await fetch(`http://127.0.0.1:8000/api/finalize-order/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"location": "lobby", "product_id": [location.state.id_product], "quantity": selectedValue, "user": username?.user_id})
            })
        }

        catch (error) {
            console.error('Error updating token:', error);
        }
    }

    


    async function addToCard(e: React.MouseEvent<HTMLInputElement>){
        e.preventDefault();

        try {
            await fetch(`http://127.0.0.1:8000/api/process/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'product_id': location.state.id_product, 'user_id': username?.user_id, "quantity": selectedValue})
            });
        }
        catch(error){console.log("Error: ", error)}
    }

    return(
        <div className = "lobby-content">

            <div className = "lobby-content-gallery mt-5">
                <div>
                    <img className = "p-5" height = "450" width = "600" src = {location.state.g1} />
                </div>

                <div>
                    <span className = "mt-p-5">{location.state.desc}</span> <br/>
                    <span>Marka: {brand}</span>
                </div>
            </div>


            <div className = "mt-5">
                <div className = "lobby-content-sidebar border border-secondary">

                    <div className = "">
                        <span>{location.state.price * selectedValue}</span><br/>
                    </div>

                    <div>
                        <a className = "fw-550" href = "">DARMOWA dostawa </a> <br/>
                    </div>

                    <div>
                        <span className = "">Lub najszybsza dostawa</span>
                    </div>

                    <div className = "d-flex align-items-center">
                        <img src = {adress} alt = "address" /> <a className = "" href = "">Wybierz adres dostawy</a>
                    </div>

                    <div>
                        <span className = {`fs-18 fw-500 ${statusColor}`}>{status}</span>
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
                            <CSRFToken />
                            <input onClick = {addToCard} type = "button" id = "add-to-card-button" value = "Dodaj do koszyka"/>
                        </form>

                        <form method = "POST">
                            <CSRFToken />

                            {selectedValue <= location.state.quantity
                            ?
                            <input onClick = {() => finalizeOrderLobby(location.state.id)} className = "bg-warning" type = "button" id = "buy-now-button" value = "Kup teraz" />
                            :
                            <input disabled type = "button" className = "bg-danger" id = "buy-now-button" value = "Nie mamy takiej ilości produktu" />
                            }

                            
                        </form>
                    </div>

                    <div className = "d-flex align-items-center">
                        <img src = {padlock2} />
                        <a className = "ms-1" href = "">Bezpieczna transakcja</a>
                    </div>

                    <div>
                        <span>Wysyłka i sprzedaż przez Amazon.</span>
                    </div>

                    <div>
                        <span>Zasady dotyczące zwrotów:</span> <br/>
                        <a href = "">Możliwość zwrotu do 31 stycznia 2023</a>
                    </div>

                </div>
            </div>
        </div>
    );

}

export default Lobby;