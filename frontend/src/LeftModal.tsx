import React from 'react';

export interface LeftModalProps{
    className: string;
}


const LeftModal: React.FC<LeftModalProps> = ({ className }) => {

    return(
        <div className = {`left-modal ${className}`}>

            <div className = "left-modal-header">
                <div className = "">

                </div>

                <div className = "left-modal-header-d">
                    <p className = "fw-600">Witamy, zaloguj się</p>
                </div>
            </div>

            <div className = "left-modal-body">
                <div>
                    <a href = "#" className = "fw-550">Przegladaj według kategorii</a>
                    <a href = "#">Echo i Alexa</a>
                    <a href = "#">Fire TV</a>
                    <a href = "#">Czytniki i e-booki Kindle</a>
                    <a href = "#">Ksiązki</a>
                    <a href = "#">Elektronika, komputery, biuro</a>

                    <a href = "#">Dom i ogród</a>
                    <a href = "#">Dziecko, zabawki i gry</a>
                    <a href = "#">Artykuły spożywcze</a>
                    <a href = "#">Uroda, zdrowie i gospodarstwo domowe</a>
                    <a href = "#">Odzież, obuwie i akcesoria</a>
                    <a href = "#">Sport i turystyka</a>
                    <a href = "#">Gry wideo</a>
                    <a href = "#">Muzyka, filmy i programy TV</a>
                    <a href = "#">Zwierzęta</a>
                    <a href = "#">Hobby</a>
                    <a href = "#">Motoryzacja</a>
                    <a href = "#">Biznes, przemysł i nauka</a>
                    <a href = "#">Karty podarunkowe</a>
                </div>

                <div className = "line-separator"></div>

            <div>
                <a href = "#">Programy i usługi</a>
                <a href = "#">Okazje</a>
                <a href = "#">Karty podarunkowe</a>
                <a href = "#">Prime Video</a>
                <a href = "#">Amazon Music</a>
                <a href = "#">Sprzedawaj na Amazon</a>
            </div>

            <div className = "line-separator"></div>
                <div>
                    <a href = "#">Pomoc i ustawienia</a>
                    <a href = "#">Moje konto</a>
                    <a href = "#">Dział Obsługi Klienta</a>
                    <a href = "#">Zaloguj sie</a>

                </div>
            </div>

        </div>
    );

}

export default LeftModal;