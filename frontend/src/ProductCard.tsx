import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState, useRef, useEffect} from 'react';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import {useLocation} from 'react-router-dom';
import React from 'react';
import { starStyling } from './static_ts_files/starStyling';

//import { starStyling } from './static_ts_files/startStyling';

interface StarStyling {
    icon: unknown;
    style: string;
}


interface StarStylingArray {
    [index: number]: StarStyling[];
}



interface ProductCard {
    item: {
        brand: string;
        description: string;
        gallery1: boolean | null;
        gallery2: boolean | null;
        gallery3: boolean | null;
        id: number;
        image: string;
        price: number;
        quantity: number;
        status?: boolean | null;
        subcategory_name: number;
        title: string;
    };

    rate: number;
}




const ProductCard: React.FC<ProductCard> = ({ item, rate }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [rateRange, setRateRange] = useState(2);

    function handleClick(){

        let slug = item.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {id_product: item.id, image: item.image, desc: item.description, price: item.price
        , g1: item.gallery1, status: item.quantity, brand: item.brand, slug: slug}})
    }



    useEffect(() => {
        if(rate <= 5 && rate >= 4.76){
               setRateRange(0);
               // starStyling[0].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

        else if(rate <= 4.75 && rate >= 4.26){
            setRateRange(1);
             //   starStyling[1].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

        else if(rate <= 4.25 && rate >= 3.76){

            setRateRange(2);
             //   starStyling[2].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 3.75 && rate >= 3.26){

            setRateRange(3);
               // starStyling[3].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 3.25 && rate >= 2.76){

            setRateRange(4);
             //   starStyling[4].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 2.75 && rate >= 2.26){

            setRateRange(5);
              //  starStyling[5].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 2.25 && rate >= 1.76){

            setRateRange(6);
               // starStyling[6].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 1.75 && rate >= 1.26){

            setRateRange(7);
               // starStyling[7].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 1.25 && rate >= 0.76){

            setRateRange(8);
               // starStyling[8].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 0.75 && rate >= 0.26){

            setRateRange(9);
             //   starStyling[9].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(rate <= 0.25){

            setRateRange(10);
                //starStyling[10].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

    }, [])


    //console.log(starStyling[2].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />));
//<FontAwesomeIcon icon={faStarHalfStroke} className = "star-rating-icon" />

    return(
        <div className = "product-card-content">
            <div>
                <img loading = "lazy" width = "288" height = "234" className = "p-3" src = {item.image} />
            </div>

            <div className = "ps-3 pt-3">
                <span onClick = {handleClick} className = "a-text-normal">{item.description.substring(0, 150)}...</span>
            </div>

            <div className = "star-rating-container p-3">
                {starStyling[rateRange].map((item: any, index: number) => (<div key = {index} className = {item.style}><FontAwesomeIcon icon = {item.icon} className = "star-rating-icon-small" /></div>) )}
            </div>

            <div className = "ps-3 pb-3">
                <p className = "fw-500">{item["price"]}</p>
                <span>Dostawa do dnia:</span><br/>
                <span>DARMOWA dostawa przez Amazon</span>
            </div>
        </div>
    );

}


export default ProductCard;