import React, { useEffect, useState, useContext } from 'react';
import { TransactionsAPI } from './Transactions';
import { ProductsInterface } from './static_ts_files/commonInterfaces';
import AuthContext from "./AuthenticationContext";
import ProductsPerTransaction from './ProductsPerTransaction';
import getCookie from './getCookie';

interface SingleTransactionProps {
    transaction: TransactionsAPI;
}

interface ProductsPerTransactionChild extends ProductsInterface {
    count: number;
}

const SingleTransaction: React.FC<SingleTransactionProps> = ({ transaction }) => {

    const [products, setProducts] = useState<ProductsPerTransactionChild[]>();
    const {authToken} = useContext(AuthContext);

    useEffect(() => {
        const joinedIDs = transaction.bought_products.join(',');
    
        try {
            fetch(`http://127.0.0.1:8000/api/transactions/single/${joinedIDs}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type':'application/json',
                },
            })
            .then(response => response.json())
            .then(result => (console.log(result), setProducts(result)))
        }
        
        catch (error) {
            console.log(error)
            alert(`"There was an error displaying your transaction."`);
        }
        
    }, []);

    return(
            <div className = "single-transaction-card-content">
                
                <div className = "single-transaction-card-content-header p-4">
                    <div>
                        <span>DATA ZŁOŻENIA <br/>ZAMÓWIENIA</span><br/>
                        <span>{transaction.date}</span>
                    </div>

                    <div className = "text-left">
                        <span>SUMA</span><br/>
                        <span>{transaction.total_price} {getCookie("currency")}</span>
                    </div>

                    <div className = "text-right">
                        <span>NR ZAMÓWIENIA</span><br/>
                        <span>{transaction.transaction_number || 'KOD'}</span>
                    </div>
                </div>
                
                <div className = "single-transaction-card-content-main">
                    {products?.map((product: ProductsPerTransactionChild, index: number) => {
                        return (
                            <ProductsPerTransaction key = {index} product = {product} />
                        );
                    })}
                </div>

                <div className = "single-transaction-card-footer">
                    <span className = "ms-3">Zarchiwizuj zamówienie</span>
                </div>

            </div>
    );

}


export default SingleTransaction;





