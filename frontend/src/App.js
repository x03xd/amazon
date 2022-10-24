
import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {useState} from 'react';
import Modal from './Modal';
import LeftModal from './LeftModal';
import stylesTags from './TagsStyling.module.css';
import stylesAuthLayout from './AuthLayout.module.css';
import stylesApp from './App.module.css';
import stylesModal from './Modal.module.css';
import AuthLayout from './AuthLayout';

function App(props) {

    const [overlayStyle, setOverlayStyle] = useState("")
    const [loginModalStyle, setLoginModalStyle] = useState("")

    function overlayStyler(style){
        setOverlayStyle(style);
    }

    function loginModalStyler(style){
        setLoginModalStyle(style);
    }


    return (
            <div className = "main-container-app">

                <div className = "navbar">
                    <Navbar overlayStyle = {overlayStyler} loginModalStyle = {loginModalStyler} />

                    <Modal className = {`login-modal ${loginModalStyle}`} />
                </div>

                <div className = "main">
                    <div></div>

                    <div className = "content">

                        <div className = {`overlay ${overlayStyle}`} onClick = {() => {setOverlayStyle(""); setLoginModalStyle("");}}>
                        </div>

                        <Outlet />

                        <LeftModal />
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
