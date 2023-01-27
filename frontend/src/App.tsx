import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React, {useState, useEffect, useContext, useMemo} from 'react';
import Modal from './Modal';
import LeftModal from './LeftModal';
import  './css_modules/TagsStyling.css';
import  './css_modules/AuthLayout.css';
import  './css_modules/App.css';
import  './css_modules/Modal.css';
import './css_modules/CardFinalizing.css';
import AuthLayout from './AuthLayout';
import './css_modules/Main.css';
import './css_modules/Store.css';
import  './css_modules/Navbar.css';
import  './css_modules/Footer.css';
import  './css_modules/Banner.css';
import  './css_modules/Lobby.css';
import  './css_modules/Card.css';
import  './css_modules/CardObject.css'
import  './css_modules/Alert.css';
import AuthContext from "./AuthenticationContext";
import './css_modules/Rating.css';
import CardFinalizing from './CardFinalizing';



const App: React.FC = () => {

    let {authToken, username, loginUser} = useContext(AuthContext)

    useEffect(() => {
        if(authToken != null){
            console.log("loggedIn");
        }
    })

    const [overlayStyle, setOverlay] = useState<string>("");
    const [loginModalStyle, setLoginModal] = useState<string>("");
    const [leftModalStyle, setLeftModal] = useState<string>("");
    const [unclick, setUnclick] = useState<string>("");

    function overlayStyler(style: string){
        setOverlay(style);
    }

    function loginModalStyler(style: string){
        setLoginModal(style);
    }

    function leftModalStyler(style: string){
        setLeftModal(style);
    }

    function unclickableNavbar(style: string){
        setUnclick(style);
    }


    return (
            <div className = "main-container">
                    <div className = {`navbar ${unclick} col-12`}>
                        <Navbar unclick = {unclick} overlayStyle = {overlayStyler} loginModalStyle = {loginModalStyler} leftModalStyle = {leftModalStyler} unclickableNavbarChild = {unclickableNavbar} />

                        <Modal className = {loginModalStyle} />

                        <LeftModal className = {`left-modal ${leftModalStyle}`}/>
                    </div>

                    <div className = "side-main"></div>

                    <div className = "main">

                        <div className = "content mt-4">
                            <div className = {`overlay ${overlayStyle}`} onClick = {() => {setOverlay(""); loginModalStyler(""); setLeftModal(""); unclickableNavbar("")}}></div>
                            <Outlet />
                        </div>

                    </div>

                    <div className = "side-main-2"></div>

                    <div className = "footer">
                        <Footer />
                    </div>
            </div>
    );
}



export default App;