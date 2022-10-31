
import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {useState} from 'react';
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


function App(props) {

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

    return (
            <div className = "main-container">

                    <div className = {`navbar ${unclick} col-12`}>
                        <Navbar unclick = {unclick} overlayStyle = {overlayStyler} loginModalStyle = {loginModalStyler} leftModalStyle = {leftModalStyler} unclickableNavbar = {unclickableNavbar} />

                        <Modal className = {`login-modal ${loginModalStyle}`} />

                        <LeftModal className = {`left-modal ${leftModalStyle}`}/>
                    </div>


                    <div className = "main">
                        <div></div>

                        <div className = "content mt-4">
                            <div className = {`overlay ${overlayStyle}`} onClick = {() => {setOverlay(""); setLoginModal(""); setLeftModal(""); unclickableNavbar('')}}></div>
                            <Outlet />
                        </div>

                        <div></div>
                    </div>


                    <div className = "footer">
                        <Footer />
                    </div>

            </div>
    );
}



export default App;
