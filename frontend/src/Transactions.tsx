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

    const [transactions, setTransactions] = useState<TransactionsAPI[]>();
    const [products, setProducts] = useState<[TransactionsAPI, Products][]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);

    const {username, authToken} = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(authToken == null) navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }, [])

    
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
                fetch('http://127.0.0.1:8000/api/products-from-transactions/', {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({"lst": transactions})
                })
                .then(response => response.json())
                .then(result => setProducts(result));
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
                                products?.map((item, index: number) => <SingleTransaction transaction = {item} key = {index} product_id = {item[1]["id"]} />)
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