import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useContext } from 'react';
import React from 'react';
import { ratingStars } from './static_ts_files/ratingLevels';
import AuthContext from "./AuthenticationContext";
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface CountingRateProps {
    rate: number | null;
    product_id?: number;
}

const CountingRate: React.FC<CountingRateProps> = ({rate, product_id}) => {

    const [rateRange, setRateRange] = useState<number | null>(null);
    const {username} = useContext(AuthContext);

    useEffect(() => {
        if (rate !== null) {
            if(rate <= 5 && rate >= 4.76){
                setRateRange(0);
            }

            else if(rate <= 4.75 && rate >= 4.26){
                setRateRange(1);
            }

            else if(rate <= 4.25 && rate >= 3.76){
                setRateRange(2);
            }

            else if(rate <= 3.75 && rate >= 3.26){
                setRateRange(3);
            }

            else if(rate <= 3.25 && rate >= 2.76){
                setRateRange(4);
            }

            else if(rate <= 2.75 && rate >= 2.26){
                setRateRange(5);
            }

            else if(rate <= 2.25 && rate >= 1.76){
                setRateRange(6);
            }

            else if(rate <= 1.75 && rate >= 1.26){
                setRateRange(7);
            }

            else if(rate <= 1.25 && rate >= 0.76){
                setRateRange(8);
            }

            else if(rate <= 0.75 && rate >= 0.26){
                setRateRange(9);
            }

            else if(rate <= 0.25){
                setRateRange(10);
            }
        }

        else{ 
            setRateRange(10);
        }
    }, [rate])


    const productRate = async (user_rate: number) => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/rate-product/${username?.user_id}/${product_id}/${user_rate}`, {
                method: 'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"rate": user_rate, "user_id": username?.user_id, "product_id": product_id})
            })
            const responseJSON = await response.json()
        
            if(!responseJSON.status){
                alert(responseJSON?.info)
            }

            else{
                window.location.reload()
            }
        }
        catch(error){alert('An error occurred. Please try again later.');}
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
        catch(error){alert('An error occurred. Please try again later.');}
    }

    return (
        <>
    
            {product_id ? <>
                <span className = "cursor-finger" onClick={deleteRate}>reset</span><br/>
            </> : <></>}

            {rateRange !== null ? (
                ratingStars.map((_, key: number) => {        
                    return(
                        <div onClick = {() => {productRate(key+1)}} key = {key} className = {`cursor-finger ${key+1 <= (rate as number) ? "yellow-filled" : "lightgrey-empty"}`}>
                            <FontAwesomeIcon icon = {faStar} className = "star-rating-icon" />
                        </div>
                    );
                })
            ) : (
                <></>
            )}
        </>
      );

}



export default CountingRate;