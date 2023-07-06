import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import { useNavigate } from 'react-router-dom';
import SingleTransaction from './SingleTransaction'

interface TransactionsAPI {
    id: number,
    bought_products: number[],
    date: string,
    bought_by: number,
}

interface Products {
    brand: string;
    description: string;
    gallery1: boolean | null;
    gallery2: boolean | null;
    gallery3: boolean | null;
    id: number;
    image: string;
    price: number;
    quantity: number;
    status?: boolean | null;
    subcategory_name: number;
    title: string;
}

const Transactions: React.FC = () => {

    const {username} = useContext(AuthContext);

    const [transactions, setTransactions] = useState<TransactionsAPI[]>();
    const [products, setProducts] = useState<Products[]>();
    const [loading, setLoading] = useState<boolean>(true);

    const [count, setCount] = useState<number>(0);

    useEffect(() => {

        try{
            fetch(`http://127.0.0.1:8000/api/transactions/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setTransactions(result));
        }

        catch (error) {
            console.log("Error: ", error)
        }

    }, [])

    

   
    useEffect(() => {

        if(!loading){
            try{
                fetch('http://127.0.0.1:8000/api/products/', {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({"list": transactions})
                })
                .then(response => response.json())
                .then(result => console.log(result));
            }

            catch(error){
                console.log("Error: ", error)
            }
        }

        setLoading(false);
        
    }, [transactions])



    return(
        <div className = "my-account-content">

            <div></div>

            <div>
                
                <div className = "edit-profile-container">

                    <div></div>

                    <div className = "edit-profile-container-main">
                        <span className = "edit-profile-container-title">Transakcje</span>

                        <div className = "mt-3">
                            {
                                transactions?.map((item, index: number) => <SingleTransaction transaction = {item} key = {index} />)
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




export default Transactions;