import React, {useContext, useState, useEffect} from 'react';
import AuthContext from "./AuthenticationContext";
import getCookie from "./getCookie";
import {UserInterface} from './static_ts_files/commonInterfaces'

const SelectCurrency: React.FC = () => {

    const {authToken, fetchUserData} = useContext(AuthContext);
    const [selectedCurrency] = useState(getCookie("currency") || "EUR");
    const [user, setUser] = useState<UserInterface | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const userData: any = await fetchUserData();
            setUser(userData)
        }
        fetchData()
    },[])

    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {

        if(user == null)
         alert("You have to be authenticated to change preferred currency.")

        else {
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/currency-converter/`, {
                    method: 'PATCH',
                    credentials: 'include', 
                    headers: {
                        'Authorization': `Bearer ${authToken}`, 
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({"currency": e.target.value})
                })
                const responseJSON = await response.json()

                if(!responseJSON.status)
                    alert(responseJSON.message)
                
                else {
                    document.cookie = `currency=${e.target.value}`
                    window.location.reload();
                }

            }

            catch (error) {
                alert("An error occurred");
            }
        }
            
    }

    return(
        <>
            <select className = "cursor-finger" defaultValue={selectedCurrency} onChange={handleCurrencyChange}>
                <option value = "EUR">EUR</option>
                <option value = "GBP">GBP</option>
                <option value = "USD">USD</option>
                <option value = "PLN">PLN</option>
            </select>
        </>
    );

}

export default SelectCurrency;