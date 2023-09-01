import {useNavigate} from 'react-router-dom';
import React from 'react';
import getCookie from './getCookie'
import CountingRate from './CoutingRate';

interface ProductCardProps {
    item: {
        brand: string;
        description: string;
        id: number;
        image: string;
        price: number;
        quantity: number;
        category_name: number;
        title: string;
    };
    rate: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, rate }) => {

    const navigate = useNavigate();

    function handleClick(){
        let slug = item.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {title: item.title, id_product: item.id, image: item.image, desc: item.description, price: item.price,
        quantity: item.quantity, brand: item.brand, slug: slug}})
        window.location.reload()
    }

    return(
        <div className = "product-card-content">
            <div className = "product-card-image-container">
                <img alt = "product" loading = "lazy" width = "288" height = "234" className = "p-3" src = {item.image} />
            </div>

            <div className = "ps-3 pt-3">
                <span onClick = {handleClick} className = "a-text-normal">{item.description.substring(0, 150)}...</span>
            </div>

            <div className = "product-card-status ps-3 pt-1">
                {item.quantity === 0 ? <span className = "text-danger">Brak</span> : <span className = "text-success">Dostępne</span>}
            </div>

            <div className = "star-rating-container p-3">
                <CountingRate rate = {rate} />
            </div>

            <div className = "ps-3 pb-3">
                <p className = "fw-500">{item.price} {getCookie("currency") ? getCookie("currency") : "USD"}</p>
                <span>Dostawa do dnia:</span><br/>
                <span>DARMOWA dostawa przez Amazon</span>
            </div>
        </div>
    );
}


export default ProductCard;