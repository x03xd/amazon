
import {Routes, Route, useNavigate, useSearchParams} from 'react-router-dom';
import {useState, useRef } from 'react';
import logo from './images/xd.png';
import cart from './images/shopping-cart-xxl.png';
import Store from './Store';

import CSRFToken from './CSRFToken';

export default function Navbar(props){


    const navigate = useNavigate();

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

    const searchBar = useRef(null);


    function subCategoryNavigate(){
        navigate(`s`)
    }


    function returnHome(){
        navigate("");
    }


    return(
        <>
            <nav className = {props.unclick}>
                <div className = 'navbar-upper-part'>

                    <div onClick = {returnHome} className = "logo-box">
                        <img className = 'logo mt-2 ms-4' src = {logo} />
                    </div>

                    <div>
                        <span>Witamy</span><br/>
                        <span>Wybierz adres dostawy</span>
                    </div>

                    <div>
                        <form method = "GET" onSubmit = {subCategoryNavigate}>
                            <input ref = {searchBar} name = "q" className = "main-search-bar" type = "text" onClick = {() => {activeOverlay('active'); unclickableNavbar('pointer-event-handler')}}  />
                        </form>
                    </div>

                    <div className = "position-static">
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

                </div>

            </nav>
        </>
    );


}