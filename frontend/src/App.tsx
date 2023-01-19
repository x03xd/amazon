import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import {useState, useEffect, useContext} from 'react';
import Modal from './Modal.tsx';
import LeftModal from './LeftModal.tsx';
import  './css_modules/TagsStyling.css';
import  './css_modules/AuthLayout.css';
import  './css_modules/App.css';
import  './css_modules/Modal.css';
import AuthLayout from './AuthLayout.tsx';
import './css_modules/Main.css';
import './css_modules/Store.css';
import  './css_modules/Navbar.css';
import  './css_modules/Footer.css';
import  './css_modules/Banner.css';
import  './css_modules/Lobby.css';
import  './css_modules/Card.css';
import  './css_modules/CardObject.css'
import  './css_modules/Alert.css';
import AuthContext from "./AuthenticationContext.tsx";
import './css_modules/Rating.css';



function App(props) {

    let {authToken, username, loginUser} = useContext(AuthContext)



    useEffect(() => {
        if(authToken != null){
            console.log("loggedIn");
        }
    })

    const [overlayStyle, setOverlay] = useState("");
    const [loginModalStyle, setLoginModal] = useState("");
    const [leftModalStyle, setLeftModal] = useState("");

    const [unclick, setUnclick] = useState("");

    function overlayStyler(style){
        setOverlay(style);
    }

    function loginModalStyler(style){
        setLoginModal(style);
    }

    function leftModalStyler(style){
        setLeftModal(style);
    }

    function unclickableNavbar(style){
        setUnclick(style);
    }


    const [param, setParam] = useState("");


    function paramSetter(arg){
        setParam(arg);
    }


    return (
            <div className = "main-container">
                    <div className = {`navbar ${unclick} col-12`}>
                        <Navbar onSubmit = {paramSetter} unclick = {unclick} overlayStyle = {overlayStyler} loginModalStyle = {loginModalStyler} leftModalStyle = {leftModalStyler} unclickableNavbar = {unclickableNavbar} />

                        <Modal className = {loginModalStyle} />

                        <LeftModal className = {`left-modal ${leftModalStyle}`}/>
                    </div>

                    <div className = "side-main"></div>

                    <div className = "main">

                        <div className = "content mt-4">
                            <div className = {`overlay ${overlayStyle}`} onClick = {() => {setOverlay(""); loginModalStyler(""); setLeftModal(""); unclickableNavbar('')}}></div>
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