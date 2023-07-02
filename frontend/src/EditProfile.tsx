import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import EditProfileCard from "./EditProfileCard"
import EditProfileModal from "./EditProfileModal";




interface AccessToChangeUsernameState {
    username: boolean;
    email: boolean;
}


const EditProfile : React.FC = () => {

    let {username} = useContext(AuthContext);

    const data = [
        {id:1, accessLink: "username_change_allowed", link: "edit-username", header: "Nazwa użytkownika:", text: username?.username || "", buttonValue: "Edytuj"},
        {id:2, accessLink: "email_change_allowed", link: "edit-email", header: "Adres e-mail:", text: username?.email || "", buttonValue: "Edytuj"},
        {id:3, accessLink: null, link: "change-password", header: "Hasło:", text: "********", buttonValue: "Edytuj"},
        {id:4, accessLink: null, link: "add-phone", header: "Podstawowy numer telefonu komórkowego:", text: "Aby zwiększyć bezpieczeństwo konta, dodaj swój numer telefonu komórkowego.", buttonValue: "Dodaj"},
        {id:5, accessLink: null, link: "two-step-verifying", header: "Weryfikacja dwuetapowa:", text: "Dodaj poziom zabezpieczeń. Wymagaj kodu weryfikacyjnego oprócz hasła.", buttonValue: "Włącz"},
        {id:6, accessLink: null, link: "help", header: "Naruszono zabezpieczenia konta?:", text: "Podejmij takie kroki, jak zmiana hasła i wylogowanie się ze wszystkich urządzeń", buttonValue: "Rozpocznij"},
    ]


    const [style, setStyle] = useState<string>("");
    const [accessToChange, setAccessToChangeUsername] = useState<AccessToChangeUsernameState | null>(null);

    
    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/access-to-change-status/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setAccessToChangeUsername(result))
        }

        catch(error){
            console.log("Error: ", error)
        }

    }, [])
   
    const handleModalStyleFunction = (style: string) => {
        setStyle(style);
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
                                data.map((item, index: number) => <EditProfileCard access = {accessToChange} key = {index} link = {item.link} id = {index} header = {item.header} accessLink = {item.accessLink} text = {item.text} buttonValue = {item.buttonValue} modalStyleFunction = {handleModalStyleFunction}  /> )
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