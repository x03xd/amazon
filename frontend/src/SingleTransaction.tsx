import React, {useEffect, useState, useContext} from 'react';
import { ratingStars } from './static_ts_files/ratingLevels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "./AuthenticationContext";

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
    id: number;
    image: string;
    price: number;
    quantity: number;
    status?: boolean | null;
    subcategory_name: number;
    title: string;
}

interface SingleTransactionProps {
    transaction: [number, Products, string];
    product_id: number;
    key: number;
}

const SingleTransaction: React.FC<SingleTransactionProps> = ({ transaction, product_id }) => {

    const {username} = useContext(AuthContext);
    const [rate, setRate] = useState<number | undefined>()

    console.log(transaction[0])

    useEffect(() => {

        try{
            fetch(`http://127.0.0.1:8000/api/rate-product/${username?.user_id}/${product_id}/${null}`)
            .then(response => response.json())
            .then(result => setRate(result));
        }

        catch(error){
            console.log("Error: ", error)
        }

    }, [])


    const productRate = (rate: number) => {


        try{
            fetch(`http://127.0.0.1:8000/api/rate-product/${username?.user_id}/${product_id}/${rate}`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"rate": rate, "user_id": username?.user_id, "product_id": product_id})
            })
            .then(response => response.json())
            .then(result => (setRate(result), window.location.reload()))
        }

        catch(error){
            console.log("Error: ", error)
        }

    }


    const deleteRate = () => {

        try{
            fetch(`http://127.0.0.1:8000/api/delete-rate/`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"user_id": username?.user_id, "product_id": product_id})
            })
            window.location.reload()

        }

        catch(error){
            console.log("Error: ", error)
        }

    }


    return(
        <div className = "single-transaction-card">
                
            <div className = "single-transaction-card-content">
                <div>
                    <img alt = "product" src = {transaction[1]["image"]} loading = "lazy" />
                </div>
                
                <div>
                    <span>{transaction[1]["description"]}</span> <br/>
                </div>

                <div>
                    <div className = "single-transaction-card-content-left">
                        <p>Wystaw ocenę</p>
                        
                        <div className = "single-transaction-container">
                            <span onClick = {deleteRate}>reset</span>
                            {ratingStars.map((star, key) => {        
                                return(
                                    <div onClick = {() => {productRate(key+1)}} key = {key} className = {key+1 <= (rate as number) ? "yellow-filled" : "lightgrey-empty"}>
                                        <FontAwesomeIcon icon = {faStar} className = "star-rating-icon" />
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    <div className = "mt-4">
                        <span>{transaction[0]} kupionych dnia: {transaction[2]}</span>
                    </div>
                </div>

            </div>

            <div className = "single-transaction-card-button">
                

            </div>
    
        </div>
    );


}




export default SingleTransaction;





