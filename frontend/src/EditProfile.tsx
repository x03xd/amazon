import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import EditProfileCard from "./EditProfileCard"

export interface AccessToChangeUsernameState {
    username: [boolean, string];
    email: [boolean, string];
    password: [boolean, string];
}

export interface DataOfOperation {
    id: number;
    accessLink: string;
    link: string;
    header: string;
    text: string;
    buttonValue: string;
    shortcut: string;
}

const EditProfile : React.FC = () => {

    const [accessToChange, setAccessToChangeUsername] = useState<AccessToChangeUsernameState | null>(null);
    const {username} = useContext(AuthContext);

    const data: DataOfOperation[] = [
        {id: 1, accessLink: "username_change_allowed", link: "edit-username", shortcut: "username", header: "Nazwa użytkownika:", text: username?.username || "", buttonValue: "Edytuj"},
        {id: 2, accessLink: "email_change_allowed", link: "edit-email", shortcut: "email", header: "Adres e-mail:", text: username?.email || "", buttonValue: "Edytuj"},
        {id: 3, accessLink: "password_change_allowed", link: "change-password", shortcut: "password", header: "Hasło:", text: "********", buttonValue: "Edytuj"},
        {id: 4, accessLink: "", link: "add-phone", shortcut: 'phone', header: "Podstawowy numer telefonu komórkowego:", text: "Aby zwiększyć bezpieczeństwo konta, dodaj swój numer telefonu komórkowego.", buttonValue: "Dodaj"},
        {id: 5, accessLink: "", link: "two-step-verifying", shortcut: 'verifiction', header: "Weryfikacja dwuetapowa:", text: "Dodaj poziom zabezpieczeń. Wymagaj kodu weryfikacyjnego oprócz hasła.", buttonValue: "Włącz"},
        {id: 6, accessLink: "", link: "help", shortcut: 'help', header: "Naruszono zabezpieczenia konta?:", text: "Podejmij takie kroki, jak zmiana hasła i wylogowanie się ze wszystkich urządzeń", buttonValue: "Rozpocznij"},
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
                        <span className = "narrow-container-title">Logowanie i bezpieczeństwo</span>
                        <div className = "mt-3">
                            {
                                data.map((item: DataOfOperation, index: number) => <EditProfileCard access = {accessToChange} key = {index} link = {item.link} id = {index} header = {item.header} accessLink = {item.accessLink} text = {item.text} buttonValue = {item.buttonValue} shortcut = {item.shortcut} /> )
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