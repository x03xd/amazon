import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsInterface } from './static_ts_files/commonInterfaces';


interface ProductsPerTransactionChild extends ProductsInterface {
    count: number;
}


interface ProductsPerTransactionProps {
    product: ProductsPerTransactionChild
}


const ProductsPerTransaction: React.FC<ProductsPerTransactionProps> = ({ product }) => {

    const navigate = useNavigate();

    function handleClick(){
        let slug = product.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {title: product.title, id_product: product.id, image: product.image, desc: product.description, price: product.price,
        quantity: product.quantity, brand: product.brand, slug: slug}})
        window.location.reload()
    }

    return(
        <div className = "single-transaction-card-content-main-inner">
            <div className = "single-transaction-card-content-main-1">
                <img src = {product.image} height = "64" width = "64" alt = "product" loading = "lazy" />
                <span></span> <br/>
            </div>

            <div className = "single-transaction-card-content-main-2">
                <div>
                    <span>{product.title}</span><br/>
                    <span>Ilość zakupionych: {product.count}</span><br/>
                    <button onClick = {handleClick} className = "view-product-transactions">Wyświetl swój produkt</button>
                </div>
            </div>

            <div className = "single-transaction-card-content-main-3 p-3">
                <div className = "p-3">
                    <button className = "view-product-transactions">Zgłoś problem</button><br/><br/>
                    <button onClick = {handleClick} className = "view-product-transactions">Napisz recenzję</button>
                </div>
            </div>
        </div>
    );

}

export default ProductsPerTransaction;





