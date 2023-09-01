import React, {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import SingleTransaction from './SingleTransaction'
import leftArrow from './images/left-arrow.png';
import rightArrow from './images/right-arrow.png';
import { ProductsInterface } from './static_ts_files/commonInterfaces';


interface TransactionsAPI {
    id: number,
    bought_products: number[],
    date: string,
    bought_by: number,
}

export interface Products {
    brand: string;
    description: string;
    id: number;
    image: string;
    price: number;
    quantity: number;
    subcategory_name: number;
    title: string;
}

const Transactions: React.FC = () => {

    const [transactions, setTransactions] = useState<TransactionsAPI[] | null>(null);
    const [products, setProducts] = useState<[number, ProductsInterface, string][]>();
    const [loading, setLoading] = useState<boolean>(true);

    const [pages, setPages] = useState<number>(0);
    const {username} = useContext(AuthContext);


    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/transactions/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setTransactions(result || []));
        }
        catch(error){alert("There was an error displaying your transaction.");}
    }, [pages])

    
    useEffect(() => {

        if(!loading){
            try{
                fetch(`http://127.0.0.1:8000/api/products-from-transactions/`, {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({"lst": transactions, "pages": pages})
                })
                .then(response => response.json())
                .then(result => setProducts(result));
            }

            catch(error){alert('An error occurred. Please try again later.');}
        }

        setLoading(false);
    }, [transactions])

    const selectPage = (num: number) => {
        if(products?.length !== 5 && num > 0) return null;
        if(pages + num >= 0) {setPages(current_page => current_page + num)}
    }

    return(
        <div className = "my-account-content">
            <div></div>

            <div>
                <div className = "edit-profile-container">

                    <div></div>

                        <div className = "edit-profile-container-main">
                            <span className = "edit-profile-container-title">Transakcje</span>

                            {
                                transactions !== null ? (
                                    transactions.length > 0 ? (
                                    <>
                                        <img
                                        onClick={() => selectPage(-5)}
                                        className="mb-3 ms-3"
                                        width="32"
                                        src={leftArrow}
                                        alt="left-arrow"
                                        loading="lazy"
                                        />
                                        <img
                                        onClick={() => selectPage(5)}
                                        className="mb-3 ms-3"
                                        width="32"
                                        src={rightArrow}
                                        alt="left-arrow"
                                        loading="lazy"
                                        />

                                        <div className="mt-3">
                                        {Array.isArray(products) ? (
                                            products.map((item, index: number) => (
                                            <SingleTransaction
                                                transaction={item}
                                                key={index}
                                                product_id={item[1]?.id}
                                            />
                                            ))
                                        ) : (
                                            <p>No products available.</p>
                                        )}
                                        </div>
                                    </>
                                    ) : (
                                    <div className="no-transactions-info-container">
                                        <span className="no-transactions-info">Brak transakcji</span>
                                    </div>
                                    )
                                ) : (
                                    <></>
                                )
                            }

                        </div>  
                    

                    <div></div>

                </div>  

            </div>

            <div></div>
        </div>
    )

}



export default Transactions;
















