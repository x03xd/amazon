
import {Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {useState} from 'react';
import Modal from './Modal';

import stylesTags from './TagsStyling.module.css';
import stylesAuthLayout from './AuthLayout.module.css';
import stylesApp from './App.module.css';
import AuthLayout from './AuthLayout';

function App(props) {

    const [style, setStyle] = useState("")

    function styler(style){
        setStyle(style);
    }


    return (

            <div className = "main-container-app">

                <div className = "navbar">
                    <Navbar onChange = {styler} />

                    <Modal className = {style} />
                </div>

                <div className = "main">
                    <div></div>

                    <div className = "content">



                        <div className = {`overlay ${style}`}>
                            <Outlet />
                        </div>
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
