import { useState, useEffect, useRef, useContext } from 'react';
import {useLocation} from 'react-router-dom';
import adress from './images/loc1.png';
import padlock2 from './images/padlock2.png';
import CSRFToken from './CSRFToken';
import AuthContext from "./AuthenticationContext";
import React from 'react';

const Lobby: React.FC = () => {

    let {username} = useContext(AuthContext)

    const location = useLocation();
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

    console.log(location.state.id_product);

        async function addToCard(e: any){
            e.preventDefault();

                let response2 = await fetch(`http://127.0.0.1:8000/api/process/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({'id': location.state.id_product, 'username': username?.username})
                })

                let jsonResponse2 = await response2.json();
                console.log(jsonResponse2)
        }


    return(
        <div className = "lobby-content">

            <div className = "lobby-content-gallery mt-5">
                <div>
                    <img className = "p-5" height = "451" width = "597" src = {location.state.g1} />
                </div>

                <div>
                    <span className = "mt-p-5">{location.state.desc}</span> <br/>
                    <a className = "" href = "">Marka: {location.state.brand}</a>
                </div>
            </div>


            <div className = "mt-5">
                <div className = "lobby-content-sidebar border border-secondary">

                    <div className = "">
                        <span>{location.state.price}</span><br/>
                    </div>

                    <div>
                        <a className = "fw-550" href = "">DARMOWA dostawa </a> <br/>
                    </div>

                    <div>
                        <span className = "">Lub najszybsza dostawa</span>
                    </div>

                    <div className = "d-flex align-items-center">
                        <img src = {adress}/> <a className = "" href = "">Wybierz adres dostawy</a>
                    </div>

                    <div>
                        <span className = {`fs-18 fw-500 ${statusColor}`}>{status}</span>
                    </div>

                    <div className = "d-flex align-items-center">
                        <label className = "" htmlFor = "quantity">Ilość: </label>

                        <select className = "ms-2 p-2" name="quantity" id="quantity">
                            <option value= "1" >1</option>
                            <option value= "2" >2</option>
                            <option value= "3" >3</option>
                        </select>
                    </div>

                    <div className = "lobby-buttons">
                        <form method = "POST">
                            <CSRFToken />
                            <input onClick = {addToCard} type = "button" id = "add-to-card-button" value = "Dodaj do koszyka"/>
                        </form>

                        <form method = "POST">
                            <CSRFToken />
                            <input className = "bg-warning" type = "button" id = "buy-now-button" value = "Kup teraz" />
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