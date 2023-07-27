import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import React from 'react';
import { starStyling } from './static_ts_files/starStyling';


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
        id: number;
        image: string;
        price: number;
        quantity: number;
        status?: boolean | null;
        category_name: number;
        title: string;
    };
    rate: number;
}



const ProductCard: React.FC<ProductCard> = ({ item, rate }) => {

    const navigate = useNavigate();
    const [rateRange, setRateRange] = useState<number>(0);

    function handleClick(){

        let slug = item.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {title: item.title, id_product: item.id, image: item.image, desc: item.description, price: item.price
        , g1: item.gallery1, status: item.quantity, brand: item.brand, slug: slug, quantity: item.quantity}})
    }


    useEffect(() => {
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

    }, [])


    return(
        <div className = "product-card-content">
            <div>
                <img alt = "product" loading = "lazy" width = "288" height = "234" className = "p-3" src = {item.image} />
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