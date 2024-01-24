
import React, { useState, useEffect, useContext} from 'react';
import CountingRate from './CountingRate';
import AuthContext from "./AuthenticationContext";
import {backendURL} from './static_ts_files/constants'


interface SingleLobbyRateProps {
    product_id: number;
    user_id?: number;
}

interface RateDict {
    rate: number;
    frequency: number;
}

const SingleLobbyRate: React.FC<SingleLobbyRateProps> = ({ product_id }) => {

    const [rate, setRate] = useState<number | null>(null);
    const [rateCount, setRateCount] = useState<number>(0);
    const [rateDict, setRateDict] = useState<RateDict[]>([]);
    const {authToken, fetchUserData} = useContext(AuthContext);

    useEffect(() => {
        fetch(`${backendURL}/avg-rate/${product_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type':'application/json',
            }
        })
        .then(response => response.json())
        .then(result => setRateCount(result[0]?.rate_count))
        .catch(error => alert(`Wystąpił błąd: ${error.message}`));
    }, []);
    

    useEffect(() => {
        fetch(`${backendURL}/rate-product/frequency/${product_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type':'application/json',
            }
        })
        .then(response => response.json())
        .then(result => setRateDict(result))
        .catch(error => alert(`Wystąpił błąd: ${error.message}`));
    }, []);
    

    useEffect(() => {
        const fetchData = async () => {

            try {
                const userData: any = await fetchUserData();
                const userId = userData?.id

                console.log(userData)

                const response = await fetch(`${backendURL}/rate-product/id/${userId}/${product_id}/`)
                const result = await response.json();
                setRate(result);
            }

            catch (error) {
                alert(`Wystąpił błąd: ${error}`);
            }
        }
        
        fetchData()
    }, []);

    
    return(
        <div className = "single-lobby-rate">  
            <div className = "star-rating-container stars-bigger">
                <CountingRate rate = {rate} product_id = {product_id} />
            </div>

            <div className = "single-lobby-quantity">
                <span>Ilość ocen: {rateCount}</span>
            </div>

            <div>
                <div className="rate-bars-container mt-3">

                {rateDict.length > 0 ? (
                    rateDict.map((rate: RateDict, index: number) => {
                        const percentage = (rate.frequency / rateCount) * 100;

                        return (
                            <div key={index} className="rate-bar-flex">
                                <div>Ocena {5 - index}</div>
                                <div key={index} className="rate-bar" style={{ width: `${percentage}%`, backgroundColor: 'orange' }}>
                                    <span className="ms-1">{percentage.toFixed(2)}%</span>
                                </div>
                            </div>
                        );
                    })
                ) : null}

                </div>

            </div>
        </div>
    );

}

export default SingleLobbyRate;