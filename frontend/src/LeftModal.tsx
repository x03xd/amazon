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
                    <a className = "fw-550">Przegladaj według kategorii</a>
                    <a href = "">Echo i Alexa</a>
                    <a>Fire TV</a>
                    <a>Czytniki i e-booki Kindle</a>
                    <a>Ksiązki</a>
                    <a>Elektronika, komputery, biuro</a>

                    <a>Dom i ogród</a>
                    <a>Dziecko, zabawki i gry</a>
                    <a>Artykuły spożywcze</a>
                    <a>Uroda, zdrowie i gospodarstwo domowe</a>
                    <a>Odzież, obuwie i akcesoria</a>
                    <a>Sport i turystyka</a>
                    <a>Gry wideo</a>
                    <a>Muzyka, filmy i programy TV</a>
                    <a>Zwierzęta</a>
                    <a>Hobby</a>
                    <a>Motoryzacja</a>
                    <a>Biznes, przemysł i nauka</a>
                    <a>Karty podarunkowe</a>
                </div>

                <div className = "line-separator"></div>

            <div>
                <a>Programy i usługi</a>
                <a>Okazje</a>
                <a>Karty podarunkowe</a>
                <a>Prime Video</a>
                <a>Amazon Music</a>
                <a>Sprzedawaj na Amazon</a>
            </div>

            <div className = "line-separator"></div>
                <div>
                    <a>Pomoc i ustawienia</a>
                    <a>Moje konto</a>
                    <a>Dział Obsługi Klienta</a>
                    <a>Zaloguj sie</a>

                </div>
            </div>

        </div>
    );

}

export default LeftModal;