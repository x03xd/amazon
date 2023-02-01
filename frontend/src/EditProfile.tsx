import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import EditProfileCard from "./EditProfileCard"
import EditProfileModal from "./EditProfileModal";





const EditProfile : React.FC = () => {


    let {username} = useContext(AuthContext);

    const data = [
        {id:1, link: "edit-username", header: "Nazwa użytkownika:", text: username?.username || "", buttonValue: "Edytuj"},
        {id:2, link: "edit-email", header: "Adres e-mail:", text: username?.email || "", buttonValue: "Edytuj"},
        {id:3, link: "change-password", header: "Hasło:", text: "********", buttonValue: "Edytuj"},
        {id:4, link: "add-phone", header: "Podstawowy numer telefonu komórkowego:", text: "Aby zwiększyć bezpieczeństwo konta, dodaj swój numer telefonu komórkowego.", buttonValue: "Dodaj"},
        {id:5, link: "two-step-verifying", header: "Weryfikacja dwuetapowa:", text: "Dodaj poziom zabezpieczeń. Wymagaj kodu weryfikacyjnego oprócz hasła.", buttonValue: "Włącz"},
        {id:6, link: "help", header: "Naruszono zabezpieczenia konta?:", text: "Podejmij takie kroki, jak zmiana hasła i wylogowanie się ze wszystkich urządzeń", buttonValue: "Rozpocznij"},
    ]


    const [style, setStyle] = useState("");


    const handleModalStyleFunction = (style: string) => {
        setStyle(style);
        console.log(style)
    }

    return(
        <div className = "my-account-content">

            <EditProfileModal className = {style} />

            <div></div>

            <div>
                
                <div className = "edit-profile-container">

                    <div></div>

                    <div className = "edit-profile-container-main">
                        <span className = "edit-profile-container-title">Logowanie i bezpieczeństwo</span>

                        <div className = "mt-3">
                            {
                                data.map((item, index: number) => <EditProfileCard key = {index} link = {item.link} id = {index} header = {item.header} text = {item.text} buttonValue = {item.buttonValue} modalStyleFunction = {handleModalStyleFunction} /> )
                            }
                                
                        </div>

                    </div>  

                    <div></div>

                </div>  

            </div>

            <div></div>


        </div>
    )

}






export default EditProfile