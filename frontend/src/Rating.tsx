import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect} from 'react';
import { ratingStars, ratingLevels } from './static_ts_files/ratingLevels';


const Rating: React.FC = () => {

    const [rate, setRate] = useState<number | null>(null);
    const searchParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        const rate = localStorage.getItem("rating");
        if (rate) {
            try {
                const parsedRate = JSON.parse(rate)["num"];
                setRate(parsedRate);
            } catch (error) {
                console.error("Error parsing rate from localStorage: ", error);
            }
        }
    },[]);
    

    useEffect(() => {
        const boolVal = rate == null || !(rate > 0) ? false : true;
        const object = {value: boolVal, num: rate};
        localStorage.setItem("rating", JSON.stringify(object))
    }, [rate]);


    function ratingFilter(rating: number){
        setRate(rating);
        searchParams.set('rating', String(rating));

        const modifiedQueryString = searchParams.toString();
        const baseUrl = window.location.href.split('?')[0];
        const updatedUrl = baseUrl + '?' + modifiedQueryString;

        window.location.href = updatedUrl;
    }

    //<div onClick = {() => {ratingFilter(row[1]["key"])}} key = {key} className = {ratingStars[key][1]}>

    return(
        <>
            {ratingLevels.map((row, index) => {

                for(let i = 0; i <= 4; i++){
                    ratingStars[i][1] = "lightgrey-empty";
                }

                for(let i = 0; i <= ratingLevels[index][1]["key"] - 1; i++){
                    ratingStars[i][1] = "yellow-filled";
                }

                return(
                    <div key = {index} className = "star-rating-container mt-1">
                        {ratingStars.map((star, key) => {        
                    
                            return(
                                <div onClick = {() => {ratingFilter(row[1]["key"])}} key = {key} className = {ratingStars[key][1]}>
                                    <FontAwesomeIcon icon = {faStar} className = "star-rating-icon" />
                                </div>
                            );

                        })}
                        <span>i więcej</span>
                    </div>
                );

            })}
        </>
    );

}

export default Rating;