import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useState, useEffect} from 'react';
import React from 'react';
import { starStyling, StarStyling } from './static_ts_files/starStyling';


interface CountingRateProps {
    rate: number | null;
}


const CountingRate: React.FC<CountingRateProps> = ({rate}) => {

    const [rateRange, setRateRange] = useState<number>(0);

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

        else setRateRange(10)

    }, [])


    return(
        <>
            {starStyling[rateRange].map((item: StarStyling, index: number) => (<div key = {index} className = {item.style}><FontAwesomeIcon icon = {item.icon} className = "star-rating-icon-small" /></div>) )}
        </>
    );

}



export default CountingRate;