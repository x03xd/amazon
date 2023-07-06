import React, {useEffect, useState, useContext} from 'react';


interface TransactionsAPI {
    id: number,
    bought_products: number[],
    date: string,
    bought_by: number,
}


interface SingleTransactionProps {
    transaction: TransactionsAPI;
    key: number;
}

const SingleTransaction: React.FC<SingleTransactionProps> = ({ transaction }) => {




    return(
        <div className = "edit-profile-card">
                
            <div className = "edit-profile-card-content">
                <span>x</span> <br/>
                    
            </div>

            <div className = "edit-profile-card-button">
                <button className = "button-standard-gradient">g</button>

            </div>
    
        </div>
    );


}




export default SingleTransaction;





