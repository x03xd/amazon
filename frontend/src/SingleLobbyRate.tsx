
import React, { useState, useEffect} from 'react';
import CountingRate from './CoutingRate';

interface SingleLobbyRateProps {
    product_id: number;
}

const SingleLobbyRate: React.FC<SingleLobbyRateProps> = ({ product_id }) => {
    const [rate, setRate] = useState<any>();
    const [singleRate, setSingleRate] = useState<any>();

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/avg-rate/`)
            .then(response => response.json())
            .then(result => (setRate(result?.average_rate), console.log(result)));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [])

    useEffect(() => {
        const stringified_product_id = product_id.toString();
        const productWithRate = rate.find((item: any) => item.rated_products === stringified_product_id);

        setSingleRate(productWithRate?.average_rate);
    }, [rate])

    return(
        <div className = "single-lobby-rate">  
            <div>
                <p>Opinie o produkcie</p>
            </div>

            <div className = "star-rating-container stars-bigger">
                <CountingRate rate = {singleRate} />
            </div>

            <div></div>

            <div></div>
        </div>
    );

}

export default SingleLobbyRate;