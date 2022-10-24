
import deliverImage from './logo.png';
import {useState} from 'react';


export default function Navbar(props){

    const changeStyle = () => {
        props.onChange("active");
    }

    const changeStyle2 = () => {
        props.onChange("");
    }


    return(
        <>
            <nav>
                <div className = 'navbar-upper-part'>

                        <div className = "logo-box">
                            <img className = "logo-image" src = {deliverImage} alt = "logo"/>
                            <span className = "logo-text"> DeliverService </span>
                        </div>

                        <div>
                            <a>Wybierz adres dostawy</a>
                            <input className = "main-search-bar" type = "text" />

                            <a onClick = {changeStyle2} onMouseOver = {changeStyle} className = "login">Konto i listy</a>
                            <a>Zwroty i zamówienia</a>
                            <a>Koszyk</a>
                        </div>

                </div>



                <div className = 'navbar-lower-part'>
                    <div>
                        <a>Menu</a>
                        <a>Prime</a>
                        <a>Okazje</a>
                        <a>Bestsellery</a>
                        <a>Karty Podarunkowe</a>
                        <a>Sprzedawaj na Amazon</a>
                        <a>Dział Obsługi Klienta</a>
                    </div>

                    <div>
                        <a>KONTENT DO ZROBIENIA</a>
                    </div>

                </div>

            </nav>
        </>
    );


}