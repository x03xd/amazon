import React from 'react';
import { ProductsInterface } from './static_ts_files/commonInterfaces';

interface SingleTransactionProps {
    transaction: [number, ProductsInterface, string];
    product_id: number;
    key: number;
}

const SingleTransaction: React.FC<SingleTransactionProps> = ({ transaction }) => {

    return(
        <div className = "single-transaction-card">
                
            <div className = "single-transaction-card-content">
                <div>
                    <img width = "50" alt = "product" src = {transaction[1]?.image} loading = "lazy" />
                </div>
                
                <div>
                    <span>{transaction[1]?.description}</span> <br/>
                </div>

                <div>
                    <div className = "single-transaction-card-content-left">
                    </div>

                    <div>
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





