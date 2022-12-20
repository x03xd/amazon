import { useState, useEffect, useRef } from 'react';
import {useLocation} from 'react-router-dom';
import adress from './images/loc1.png';
import padlock2 from './images/padlock2.png';
import RequestUser from './RequestUser';

export default function Lobby(props){

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


    const location = useLocation();

    let status = location.state.status
    let statusColor;


    if(status){
        status = "Dostępny"
        statusColor = "text-success";
    }

    else {
        status = "Niedostępny"
        statusColor = "text-danger";
    }

    console.log(location.state.id_product);


        async function addToCard(e){
            e.preventDefault();



                let response2 = await fetch(`http://127.0.0.1:8000/api/process/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({id: location.state.id_product})
                })

                let jsonResponse2 = await response2.json();
                console.log(jsonResponse2)

        }


    return(
        <div className = "lobby-content">
        <RequestUser />
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
                        <span className = "">Lub najszybsza dostawa </span>
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
                        <input onClick = {addToCard} type = "button" id = "add-to-card-button" value = "Dodaj do koszyka"/>
                        <input className = "bg-warning" type = "button" id = "buy-now-button" value = "Kup teraz" />
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