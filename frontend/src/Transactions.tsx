import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import SingleTransaction from './SingleTransaction'


export interface TransactionsAPI {
    id: number,
    bought_products: number[],
    date: string,
    bought_by: number,
    total_price: string,
    transaction_number: string | null,
}

const Transactions: React.FC = () => {

    const currentDate = new Date();

    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [transactions, setTransactions] = useState<TransactionsAPI[] | null>(null);
    const [optionYear, setOptionYear] = useState<number[]>([]);
    const {username} = useContext(AuthContext);

    useEffect(() => {

        try{
            fetch(`http://127.0.0.1:8000/api/transactions/${username?.user_id}/${selectedYear}`)
            .then(response => response.json())
            .then(result => (setTransactions(result || []), console.log(result)));
        }
        catch(error){alert("There was an error displaying your transaction.");}

    }, [selectedYear])


    useEffect(() => {
        for(let i=0; i < 10; i++){
            setOptionYear(prev => [...prev, selectedYear - i])
        }
    }, [])

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = parseInt(e.target.value, 10);
        setSelectedYear(newValue);
    }

    return(
        <div className = "my-account-content">
            <div></div>

            <div>
                <div className = "transaction-profile-container">
                    <div></div>

                        <div className = "transaction-profile-container-main">
                            <div className = "transaction-profile-container-header">
                                <span className = "narrow-container-title">Transakcje</span>

                                <div className = "ms-3 mt-1">
                                    {selectedYear ? (
                                        <select className = "cursor-finger" defaultValue={selectedYear} onChange={handleYearChange}>
                                            {optionYear.map((year: number, index: number) => {
                                                return(
                                                    <option key = {index} value = {year}>{year}</option>
                                                )
                                            })}
                                        </select>

                                        ) : (
                                            <></>
                                        )
                                    }
                                </div>
                            </div>

                                {
                                    transactions?.map((transaction: TransactionsAPI, index: number) => {
                                        return(
                                            <SingleTransaction key = {index} transaction = {transaction} />
                                        )
                                    })
                                }
                        </div>  
                    
                    <div></div>

                </div>  
            </div>

            <div></div>
        </div>
    );

}

export default Transactions;
















