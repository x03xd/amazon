
import deliverImage from './logo.png';




export default function Footer(){


    return(
        <>
            <footer>
                <div className = "footer-upper-part">
                </div>

                <div className = "footer-upper-mid-part">

                    <ul>
                        <li>O nas</li>
                        <li>asdasd</li>
                        <li>asdasd</li>
                    </ul>


                    <ul>
                        <li>Zarabiaj z nami</li>
                        <li>asdasd</li>
                        <li>asdasd</li>
                    </ul>


                    <ul>
                        <li>Metody płatności</li>
                        <li>asdasd</li>
                        <li>asdasd</li>
                    </ul>


                    <ul>
                        <li>Obserwuj nas</li>
                        <li>asdasd</li>
                        <li>asdasd</li>
                    </ul>


                    <ul>
                        <li>Potrzebujesz pomocy?</li>
                        <li>asdasd</li>
                        <li>asdasd</li>
                    </ul>
                </div>

                <div className = "hr-div"></div>

                <div className = "footer-lower-mid-part">
                    <div></div>

                    <div className = "logo-box">
                        <img className = "logo-image" src = {deliverImage} alt = "logo"/>
                        <span className = "logo-text"> DeliverService </span>
                    </div>

                    <div>
                        <ul>
                            <li>Australia</li>
                            <li>Chiny</li>
                            <li>Niemcy</li>
                            <li>Brazylia</li>
                            <li>Kanada</li>
                            <li>Hiszpania</li>
                            <li>USA</li>
                            <li>Francja</li>
                            <li>Arabia Saudyjska</li>
                        </ul>
                    </div>

                    <div></div>
                </div>

                <div className = "footer-lower-part">
                </div>
            </footer>
        </>
    );


}