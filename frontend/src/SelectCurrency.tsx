import React, {useContext} from 'react';
import AuthContext from "./AuthenticationContext";


const SelectCurrency: React.FC = () => {

    const {username} = useContext(AuthContext);

    console.log(username)

    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {

        try{
            const response = await fetch(`http://127.0.0.1:8000/api/currency-converter/${username?.user_id}`, {
                method: 'PATCH',
                credentials: 'include', 
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"currency": e.target.value})
            })
            const responseJSON = await response.json();
            console.log(responseJSON)

        }
        catch(error){alert('An error occurred. Please try again later.');}
    }



    return(
        <>
            <select onChange={handleCurrencyChange}>
                <option value = "EUR">EUR</option>
                <option value = "GBP">GBP</option>
                <option value = "USD">USD</option>
                <option value = "PLN">PLN</option>
            </select>
        </>
    );

}

export default SelectCurrency;