

import logo from './images/xd.png';



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

                <div className = "line-separator"></div>

                <div className = "footer-lower-mid-part">
                    <div></div>

                    <div className = "logo-box text-center">
                        <img src = {logo} height = '25'/>
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

                    <div className = "footer-lower-part-inner">
                        <div></div>

                        <div className = "footer-lower-part-inner-main">
                            <div>
                                <a>IMDb</a>
                                <span>
                                    Filmy, seriale<br/>
                                    i gwiazdy
                                </span>
                            </div>

                            <div>
                                <a>Goodreads</a>
                                <span>
                                    Recenzje książek<br/>
                                    i rekomendacje
                                </span>
                            </div>

                            <div>
                                <a>Amazon Web Services</a>
                                <span>
                                    Skalowalna chmura<br/>
                                    Usługi obliczeniowe
                                </span>
                            </div>

                            <div>
                                <a>Amazon Music</a>
                                <span>
                                    Dostęp do<br/>
                                    milionów utworów
                                </span>
                            </div>

                            <div>
                                <a>Book Depository</a>
                                <span>
                                    Książki objęte darmową<br/>
                                    dostawą na całym świecie
                                </span>
                            </div>

                            <div>
                                <a>Alexa</a>
                                <span>
                                    Skuteczna Analityka Internetowa
                                </span>
                            </div>

                            <div>
                                <a>Shopbop</a>
                                <span>
                                    Projektanci<br/>
                                    Marki odzieżowe
                                </span>
                            </div>

                            <div>
                                <a>DPReview</a>
                                <span>
                                    Fotografia<br/>
                                    cyfrowa
                                </span>
                            </div>



                        </div>

                        <div></div>
                    </div>

                    <div className = "footer-lower-part-inner-2">
                        <a>Warunki użytkowania i sprzedaży &nbsp;&nbsp;&nbsp;</a>
                        <a>Informacja o prywatności &nbsp;&nbsp;&nbsp;</a>
                        <a>Nota Prawna &nbsp;&nbsp;&nbsp;</a>
                        <a>Cookies &nbsp;&nbsp;&nbsp;</a>
                        <a>Reklamy dopasowane do zainteresowań &nbsp;&nbsp;&nbsp;</a><br/>
                        <span>© 1996-2022 Amazon.com, Inc. lub podmioty powiązane</span>
                    </div>

                </div>
            </footer>
        </>
    );


}