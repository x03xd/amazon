import React, {useEffect, useState, useContext} from 'react';
import {useOutletContext} from 'react-router-dom';
import AuthContext from "./AuthenticationContext";
import EditProfileCard from "./EditProfileCard"
import EditProfileModal from "./EditProfileModal";





const EditProfile : React.FC = () => {

 
    let {username, email} = useContext(AuthContext);

    const x = [
        {id:1, header: "Nazwa użytkownika:", text: username?.username || "", buttonValue: "Edytuj"},
        {id:2, header: "Adres e-mail:", text: username?.email || "", buttonValue: "Edytuj"},
        {id:3, header: "Hasło:", text: "********", buttonValue: "Edytuj"},
        {id:4, header: "Podstawowy numer telefonu komórkowego:", text: "Aby zwiększyć bezpieczeństwo konta, dodaj swój numer telefonu komórkowego.", buttonValue: "Dodaj"},
        {id:5, header: "Weryfikacja dwuetapowa:", text: "Dodaj poziom zabezpieczeń. Wymagaj kodu weryfikacyjnego oprócz hasła.", buttonValue: "Włącz"},
        {id:6, header: "Naruszono zabezpieczenia konta?:", text: "Podejmij takie kroki, jak zmiana hasła i wylogowanie się ze wszystkich urządzeń", buttonValue: "Rozpocznij"},
    ]


    const [style, setStyle] = useState("");


    const handleModalStyleFunction = (style: string) => {
        setStyle(style);
        console.log(style)
    }

/*
    useEffect(() => {
        
        let response = fetch("http://127.0.0.1:8000/api/get-user-data/", {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({'email': username?.email, "username": username?.username})
        })

    }, [])
*/

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
                                x.map((item, index: number) => <EditProfileCard key = {index} id = {index} header = {item.header} text = {item.text} buttonValue = {item.buttonValue} modalStyleFunction = {handleModalStyleFunction} /> )
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