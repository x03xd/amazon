import React, {useContext, useState} from 'react';
import AuthContext from "./AuthenticationContext";
import getCookie from "./getCookie";

const SelectCurrency: React.FC = () => {

    const {authToken, username} = useContext(AuthContext);
    const [selectedCurrency] = useState(getCookie("currency") || "USD");

    
    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {

        if(!authToken) {alert("You have to be authenticated to change preferred currency");}

        else{
            try{
                await fetch(`http://127.0.0.1:8000/api/currency-converter/${username?.user_id}`, {
                    method: 'PATCH',
                    credentials: 'include', 
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({"currency": e.target.value})
                })
                document.cookie = `currency=${e.target.value}`
                window.location.reload();

            }
            catch(error){alert('An error occurred. Please try again later.');}
        }
    }

    return(
        <>
            <select disabled={!authToken} defaultValue={selectedCurrency} onChange={handleCurrencyChange}>
                <option value = "EUR">EUR</option>
                <option value = "GBP">GBP</option>
                <option value = "USD">USD</option>
                <option value = "PLN">PLN</option>
            </select>
        </>
    );

}

export default SelectCurrency;