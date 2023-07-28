import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import EditProfileCard from "./EditProfileCard"


interface AccessToChangeUsernameState {
    username: [boolean, string];
    email: [boolean, string];
    password: [boolean, string];
}

const EditProfile : React.FC = () => {

    let {username} = useContext(AuthContext);
    const [accessToChange, setAccessToChangeUsername] = useState<AccessToChangeUsernameState | null>(null);

    const data = [
        {id: 1, accessLink: "username_change_allowed", link: "edit-username", header: "Nazwa użytkownika:", text: username?.username || "", buttonValue: "Edytuj", method: "POST"},
        {id: 2, accessLink: "email_change_allowed", link: "edit-email", header: "Adres e-mail:", text: username?.email || "", buttonValue: "Edytuj", method: "POST"},
        {id: 3, accessLink: "password_change_allowed", link: "change-password", header: "Hasło:", text: "********", buttonValue: "Edytuj", method: "GET"},
        {id: 4, accessLink: null, link: "add-phone", header: "Podstawowy numer telefonu komórkowego:", text: "Aby zwiększyć bezpieczeństwo konta, dodaj swój numer telefonu komórkowego.", buttonValue: "Dodaj", method: "POST"},
        {id: 5, accessLink: null, link: "two-step-verifying", header: "Weryfikacja dwuetapowa:", text: "Dodaj poziom zabezpieczeń. Wymagaj kodu weryfikacyjnego oprócz hasła.", buttonValue: "Włącz", method: "POST"},
        {id: 6, accessLink: null, link: "help", header: "Naruszono zabezpieczenia konta?:", text: "Podejmij takie kroki, jak zmiana hasła i wylogowanie się ze wszystkich urządzeń", buttonValue: "Rozpocznij", method: "POST"},
    ]

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/access-to-change-status/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setAccessToChangeUsername(result))
        }
        catch(error){alert('An error occurred. Please try again later.');}
    }, [])


    return(
        <div className = "my-account-content">
            <div></div>

            <div>
                <div className = "edit-profile-container">

                    <div></div>

                    <div className = "edit-profile-container-main">
                        <span className = "edit-profile-container-title">Logowanie i bezpieczeństwo</span>
                        <div className = "mt-3">
                            {
                                data.map((item, index: number) => <EditProfileCard method = {item.method} access = {accessToChange} key = {index} link = {item.link} id = {index} header = {item.header} accessLink = {item.accessLink} text = {item.text} buttonValue = {item.buttonValue}  /> )
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