import git_card from '.././images/git_card.png';
import adress from '.././images/adress.png';
import amazon_app from '.././images/amazon_app.png';
import contact from '.././images/contact.png';
import message from '.././images/message.png';
import order from '.././images/order.png';
import payment from '.././images/payment.png';
import contact2 from '.././images/contant_2.png';


interface CardData {
    title: string, image : string, content: string, alt: string, link: string;
}

interface CardDataArray {
    array: CardData[]
}


const cardsData : CardDataArray["array"] = [
/*1*/   {title: "Moje zamówienia", image: order, content: "Śledź przesyłki, zwróc lub ponownie zamów kupione przedmioty", alt: "order", link: "/transactions"},
/*2*/   {title: "Logowanie i zabezpieczenia", image: contact2, content: "Edytuj login, nazwę użytkownika i numer telefonu", alt: "login and security", link: "/edit-profile"},
/*3*/   {title: "Prime", image: order, content: "Wyświetl korzyści i ustawienia płatności", alt: "prime", link: ""},
/*4*/   {title: "Adresy", image: adress, content: "Edytuj adresy i preferencje dotyczące dostawy dla zamówień oraz prezentów", alt: "adress", link: "/edit-adress"},
/*5*/   {title: "Metody płatności", image: payment, content: "Zarządzaj metodami i ustawieniami płatności oraz przeglądaj salda", alt: "payment methods", link: "/edit-payment-methods"},
/*6*/   {title: "Karty podarunkowe", image: git_card, content: "Zrealizuj karty podarunkowe", alt: "gift cards", link: ""},
/*7*/   {title: "Centrum wiadomości", image: message, content: "Wyświetl wiadomoścu od Amazon", alt: "messages", link: ""},
/*8*/   {title: "Skontaktuj się z nami", image: contact, content: "Kontakt z Działem Obsługi Kienta przez telefon, czat lub e-mail", alt: "contact", link: ""},
/*9*/   {title: "Aplikacja Amazon", image: amazon_app, content: "Pobierz aplikację Amazon", alt: "amazon app", link: ""},
]


interface CardData2 {
    title: string, content: string, link :string;
}

interface CardDataArray2 {
    array: CardData2[]
}


const cardsData2 : CardDataArray2["array"] = [
    /*1*/   {title: "Treści cyfrowe i urządzenia", content: "Śledź przesyłki, zwróc lub ponownie zamów kupione przedmioty", link: ""},
    /*2*/   {title: "Powiadomienia e-mail, wiadomości, reklamy i pliki cookie" ,content: "Edytuj login, nazwę użytkownika i numer telefonu", link: ""},
    /*3*/   {title: "Preferencje zamawiania i zakupów", content: "Wyświetl korzyści i ustawienia płatności", link: ""},
    /*4*/   {title: "Inne konta",  content: "Edytuj adresy i preferencje dotyczące dostawy dla zamówień oraz prezentów", link: ""},
    /*5*/   {title: "Dane i prywatność",  content: "Zarządzaj metodami i ustawieniami płatności oraz przeglądaj salda", link: ""},
]
    


export {cardsData, cardsData2};