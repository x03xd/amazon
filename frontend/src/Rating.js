
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef, useContext } from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import QueryParamsContext from "./QueryParamsContext";


export default function Rating(props){
    const navigate = useNavigate();

    const [rate, setRate] = useState(null);

    const ratingLevels = [
        ["4 and more", {"key": 4}],
        ["3 and more", {"key": 3}],
        ["2 and more", {"key": 2}],
        ["1 and more", {"key": 1}]
    ];

    const ratingStars = [
        ["first", null],
        ["second", null],
        ["third", null],
        ["fourth", null],
        ["fifth", null]
    ]

    useEffect(() => {
        let rate = JSON.parse(localStorage.getItem("rating"));

        if(rate){
            setRate(rate);
        }
    },[]);


    useEffect(() => {
        console.log(rate)
        localStorage.setItem("rating", JSON.stringify(rate))

    }, [rate]);


    let {c_QueryParam, q_QueryParam, u_QueryParam, u2_QueryParam, rating_QueryParam} = useContext(QueryParamsContext);


    function ratingFilter(x){
        setRate(x);

        navigate(`?q=${q_QueryParam}&c=${c_QueryParam}&u=${u_QueryParam}&rating=${x}`);

        window.location.reload();
    }


//onClick = {() => handleResult(row[0].slice(0,2))}
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
                                    <div onClick = {() => {ratingFilter(row[1]['key'])}} key = {key} className = {ratingStars[key][1]}>
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