
import {useNavigate} from 'react-router-dom';
import logo from './images/xd.png';
import React from 'react';


const Footer: React.FC = () => {

    const navigate = useNavigate();

    function scrollUp(){
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    function returnHome(){

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        });

        navigate("");
    }

    return(
        <>
            <footer>
                <div className = "footer-upper-part">
                    <span onClick = {scrollUp} className = "d-inline-block w-100 h-100">Powrót na stronę góry</span>
                </div>

                <div className = "footer-upper-mid-part">

                    <ul>
                        <li>O nas</li>
                        <li>Informacje<br/>korporacyjne</li>
                        <li>Praca</li>
                        <li>Informacje<br/>prasowe</li>
                        <li>Amazon<br/>Science</li>
                    </ul>


                    <ul>
                        <li>Zarabiaj z nami</li>
                        <li>Zareklamuj swoje<br/>produkty</li>
                        <li>Sprzedawaj na<br/>Amazon</li>
                        <li>Realizacja przez<br/>Amazon (FBA)</li>
                        <li>Program<br/>partnerski</li>
                        <li>Wydawaj z nami<br/>niezalezne<br/>produkcje</li>

                    </ul>


                    <ul>
                        <li>Metody płatności</li>
                        <li>Metody płatności</li>
                        <li>Przelewy24</li>
                    </ul>


                    <ul>
                        <li>Obserwuj nas</li>
                        <li>Youtube</li>
                        <li>Twitter</li>
                    </ul>


                    <ul>
                        <li>Potrzebujesz pomocy?</li>
                        <li>Śledź przesyłki lub <br/>wyświetl zamówienia</li>
                        <li>Koszty i zasady dostaw</li>
                        <li>Zwroty i wymiana</li>
                        <li>Recykling</li>
                        <li>Aplikacja Amazon</li>
                        <li>Dział Obsługi Klienta</li>

                    </ul>
                </div>

                <div className = "line-separator"></div>

                <div className = "footer-lower-mid-part">
                    <div></div>

                    <div onClick = {returnHome} className = "logo-box text-center">
                        <img loading = "lazy" alt = "logo" src = {logo} height = '25'/>
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
                                <a href = "">IMDb</a>
                                <span>
                                    Filmy, seriale<br/>
                                    i gwiazdy
                                </span>
                            </div>

                            <div>
                                <a href = "">Goodreads</a>
                                <span>
                                    Recenzje książek<br/>
                                    i rekomendacje
                                </span>
                            </div>

                            <div>
                                <a href = "">Amazon Web Services</a>
                                <span>
                                    Skalowalna chmura<br/>
                                    Usługi obliczeniowe
                                </span>
                            </div>

                            <div>
                                <a href = "">Amazon Music</a>
                                <span>
                                    Dostęp do<br/>
                                    milionów utworów
                                </span>
                            </div>

                            <div>
                                <a href = "">Book Depository</a>
                                <span>
                                    Książki objęte darmową<br/>
                                    dostawą na całym świecie
                                </span>
                            </div>

                            <div>
                                <a href = "">Alexa</a>
                                <span>
                                    Skuteczna Analityka Internetowa
                                </span>
                            </div>

                            <div>
                                <a href = "">Shopbop</a>
                                <span>
                                    Projektanci<br/>
                                    Marki odzieżowe
                                </span>
                            </div>

                            <div>
                                <a href = "">DPReview</a>
                                <span>
                                    Fotografia<br/>
                                    cyfrowa
                                </span>
                            </div>

                        </div>

                        <div></div>
                    </div>

                    <div className = "footer-lower-part-inner-2">
                        <a href = "">Warunki użytkowania i sprzedaży &nbsp;&nbsp;&nbsp;</a>
                        <a  href = "">Informacja o prywatności &nbsp;&nbsp;&nbsp;</a>
                        <a  href = "" >Nota Prawna &nbsp;&nbsp;&nbsp;</a>
                        <a  href = "">Cookies &nbsp;&nbsp;&nbsp;</a>
                        <a  href = "">Reklamy dopasowane do zainteresowań &nbsp;&nbsp;&nbsp;</a><br/>
                        <span>© 1996-2022 Amazon.com, Inc. lub podmioty powiązane</span>
                    </div>

                </div>
            </footer>
        </>
    );

}
export default Footer;