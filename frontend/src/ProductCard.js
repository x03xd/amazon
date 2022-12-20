
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState, useRef } from 'react';

import {useLocation} from 'react-router-dom';

export default function ProductCard(props){

    const navigate = useNavigate();
    const location = useLocation();

    function handleClick(){

        let slug = props.item.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {id_product: props.item.id, image: props.item.image, desc: props.item.description, price: props.item.price
        , g1: props.item.gallery1, status: props.item.quantity, brand: props.item.brand, slug: slug}})
    }

/*
    console.log((props.item.description).toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, ''));
*/

//    console.log(props.item)

    return(
        <div className = "product-card-content">
            <div>
                <img width = "288" height = "234" className = "p-3" src = {props.item.image} />
            </div>

            <div className = "">
                <span onClick = {handleClick} className = "a-text-normal">{props.item.description.substring(0, 150)}...</span>
            </div>

            <div className = "">
                <p className = "fw-500">{props.item["price"]}</p>
                <span>Dostawa do dnia:</span><br/>
                <span>DARMOWA dostawa przez Amazon</span>
            </div>
        </div>
    );

}