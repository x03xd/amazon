import card_picture from './images/cardz.svg';


export default function Card(){

    return(
        <div className = "card-content mt-5 bg-white">

            <div className = "card-content-left">
                <div className = "card-content-left-first bg-light">
                    <div className = "card-content-left-first-img">
                        <img width = "350" src = {card_picture} />
                    </div>

                    <div className = "card-content-left-first-content">
                        <span className = "fs-25 fw-500">Twój koszyk jest pusty</span> <br/>
                        <a href = "">Kup dzisiejsze oferty</a>

                        <div className = "mt-3">
                            <input value = "Zaloguj się na swoje konto" className = "bg-warning border rounded p-1 fs-16" type = "button"/>
                            <input value = "Zarejestruj się teraz" className = "border rounded p-1 fs-16 ms-3" type = "button"/>
                        </div>
                    </div>
                </div>

                <div className = "card-content-left-second bg-light">

                </div>

                <p className = "fs-11">Ceny i dostępność produktów w serwisie Amazon.pl mogą ulec zmianie. Produ,kty sa tymsaczowo przechowywane w koszyku. Wyświetlone w tym miescu cena są zawsze aktualne. <br/> Chesz Chcwsz zrealizować kod z karty podarunkowej lub kod promocyjny? Wpisz kod podusmowując zamówienie</p>
            </div>




            <div className = "card-content-right bg-light">
                SIDEBAR
            </div>


        </div>
    );

}