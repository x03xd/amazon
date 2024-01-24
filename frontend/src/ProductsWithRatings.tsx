import React, { useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import { ProductsInterface } from './static_ts_files/commonInterfaces';
import {backendURL} from './static_ts_files/constants'

interface Rate {
    rated_products: string;
    average_rate: number;
}

interface ProductsWithRatingsProps {
    products: ProductsInterface[]
}

const ProductsWithRatings: React.FC<ProductsWithRatingsProps> = ({ products }) => {

    const [productsWithRatings, setProductsWithRatings] = useState<JSX.Element[]>([]);
    const [averageRate, setAverageRate] = useState<Rate[]>([]);
    
    useEffect(() => {
        fetch(`${backendURL}/avg-rate`)
        .then(response => response.json())
        .then(result => setAverageRate(result))
        .catch(error => {
            alert('An error occurred. Please try again later.');
        });
    }, []);
    
    useEffect(() => {
        aLoop:
        for (let item of products) {
            for (let rate of averageRate) {
                if (Number(rate.rated_products) === item.id){
                    setProductsWithRatings(prevProducts => [
                        ...prevProducts,
                        <ProductCard key={item.id} item={item} rate={rate.average_rate} />
                    ]);
                    continue aLoop;
                }
            }
        }
    }, [products, averageRate]);

    return(
        <>
            {productsWithRatings}
        </>
    );
}

export default ProductsWithRatings;