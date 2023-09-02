
import React, { useState, useEffect} from 'react';
import CountingRate from './CoutingRate';

interface SingleLobbyRateProps {
    product_id: number;
}

interface RateDict {
    rate: number;
    frequency: number;
}

const SingleLobbyRate: React.FC<SingleLobbyRateProps> = ({ product_id }) => {
    const [rate, setRate] = useState<number | null>(null);
    const [rateCount, setRateCount] = useState<number>(0);
    const [rateDict, setRateDict] = useState<RateDict[]>([]);

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/avg-rate/${product_id}`)
            .then(response => response.json())
            .then(result => (setRate(result[0]?.average_rate), setRateCount(result[0]?.rate_count)));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [])

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/product-rates/${product_id}`)
            .then(response => response.json())
            .then(result => setRateDict(result));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [])


    return(
        <div className = "single-lobby-rate">  
            <div>
                <p>Opinie o produkcie</p>
            </div>

            <div className = "star-rating-container stars-bigger">
                <CountingRate rate = {rate} style = "plus-size-start" />
            </div>

            <div>
                <span>Ilość ocen: {rateCount}</span>
            </div>

            <div>
                <div className="rate-bars-container mt-3">
                    {rateDict.map((rate: RateDict, index: number) => {
                    const percentage = (rate.frequency / rateCount) * 100;
                        return (
                            <div key = {index} className = "rate-bar-flex">
                                <div>Ocena {5-index}</div>
                                <div key={index} className="rate-bar" style={{width: `${percentage}%`, backgroundColor: 'orange'}}>
                                    {percentage.toFixed(2)}%
                                </div>
                            </div>
                        );
                    })}
                    </div>

            </div>
        </div>
    );

}

export default SingleLobbyRate;