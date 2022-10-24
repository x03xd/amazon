
import deliverImage from './logo.png';
import {useState} from 'react';


export default function Navbar(props){

    const activeOverlay = (style) => {
        props.overlayStyle(style);
    }


    const activeLoginModal = (style) => {
        props.loginModalStyle(style);
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

                            <a onMouseOver = {() => {activeOverlay('active'); activeLoginModal('active')}}>Konto i listy</a>
                            <a>Zwroty i zamówienia</a>
                            <a>Koszyk</a>
                        </div>

                </div>





                <div className = 'navbar-lower-part'>
                    <div>
                        <a onClick= {() => {activeOverlay('active')}}>Menu</a>
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