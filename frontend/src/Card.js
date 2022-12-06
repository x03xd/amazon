import card_picture from './images/cardz.svg';


export default function Card(){

    return(
        <div className = "card-content mt-5 bg-white">
            <div className = "card-content-left bg-light">
                <div className = "card-content-left-first">
                    <div>
                        <img width = "350" src = {card_picture} />
                    </div>

                    <div className = "">
                        <span className = "fs-25 fw-500">Twój koszyk jest pusty</span> <br/>
                        <a href = "">Kup dzisiejsze oferty</a> <br/>

                        <div className = "mt-3">
                            <input value = "Zaloguj się na swoje konto" className = "bg-warning border border-secondary rounded p-1 fs-16" type = "button"/>
                            <input value = "Zarejestruj się teraz" className = "border border-secondary rounded p-1 fs-16 ms-3" type = "button"/>
                        </div>
                    </div>
                </div>

                <div className = "card-content-left-second bg-light">

                </div>
            </div>

            <div className = "card-content-right bg-light">
                SIDEBAR
            </div>

        </div>
    );

}