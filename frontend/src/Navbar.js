

import {useState} from 'react';
import logo from './images/xd.png';
import cart from './images/shopping-cart-xxl.png';

export default function Navbar(props){

    const activeOverlay = (style) => {
        props.overlayStyle(style);
    }

    const activeLoginModal = (style) => {
        props.loginModalStyle(style);
    }

    const activeLeftModal = (style) => {
        props.leftModalStyle(style);
    }

    const unclickableNavbar = (style) => {
        props.unclickableNavbar(style)
    }



    return(
        <>
            <nav className = {props.unclick}>
                <div className = 'navbar-upper-part'>

                    <div className = "logo-box">
                        <img className = 'logo mt-2 ms-4' src = {logo} />
                    </div>

                    <div>
                        <span>Witamy</span><br/>
                        <span>Wybierz adres dostawy</span>
                    </div>

                    <div>
                        <input className = "main-search-bar" type = "text" onClick = {() => {activeOverlay('active'); unclickableNavbar('pointer-event-handler')}}  />
                    </div>

                    <div>
                        <span>Witamy, zaloguj sie</span><br/>
                        <span onClick = {() => {activeOverlay('active'); activeLoginModal('active'); unclickableNavbar('pointer-event-handler')}}>Konto i listy</span>
                    </div>

                    <div>
                        <span>Zwroty</span><br/>
                        <span>i zamówienia</span>
                    </div>

                    <div className = "cart-box">
                        <img className = "cart" src = {cart} />
                        <span>Koszyk</span>
                    </div>

                </div>


                <div className = 'navbar-lower-part'>

                    <div>
                        <span className = "ms-5" onClick= {() => {activeOverlay('active'); activeLeftModal('active'); unclickableNavbar('pointer-event-handler')}}>Menu</span>
                    </div>

                    <div>
                        <span>Prime</span>
                    </div>

                    <div>
                        <span>Okazje</span>
                    </div>

                    <div>
                        <span>Bestsellery</span>
                    </div>

                    <div>
                        <span>Karty Podarunkowe</span>
                    </div>

                    <div>
                        <span>Sprzedawaj na Amazon</span>
                    </div>

                    <div>
                        <span>Dział Obsługi Klienta</span>
                    </div>


                    <div>
                        <a>KONTENT DO ZROBIENIA</a>
                    </div>

                </div>

            </nav>
        </>
    );


}