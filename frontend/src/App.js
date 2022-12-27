import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {useState, useEffect, useContext} from 'react';
import Modal from './Modal';
import LeftModal from './LeftModal';
import stylesTags from './css_modules/TagsStyling.module.css';
import stylesAuthLayout from './css_modules/AuthLayout.module.css';
import stylesApp from './css_modules/App.module.css';
import stylesModal from './css_modules/Modal.module.css';
import AuthLayout from './AuthLayout';
import stylesMain from './css_modules/Main.module.css';
import stylesStore from './css_modules/Store.module.css';
import stylesNavbar from './css_modules/Navbar.module.css';
import stylesFooter from './css_modules/Footer.module.css';
import stylesBanner from './css_modules/Banner.module.css';
import stylesLobby from './css_modules/Lobby.module.css';
import stylesCard from './css_modules/Card.module.css';
import stylesCardObject from './css_modules/CardObject.module.css'
import stylesAlert from './css_modules/Alert.module.css';
import AuthContext from "./AuthenticationContext";
import stylesRating from './css_modules/Rating.module.css';



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