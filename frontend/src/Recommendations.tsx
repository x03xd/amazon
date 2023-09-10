import {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import ProductsWithRatings from './ProductsWithRatings';
import { ProductsInterface } from './static_ts_files/commonInterfaces';


interface RecommendationProps {
    products_id: number[];
}

const Recommendations: React.FC<RecommendationProps> = ({ products_id }) => {

    const [recommended, setRecommendations] = useState<ProductsInterface[]>([]);
    const {username} = useContext(AuthContext);

    const joined = Array.isArray(products_id) ? products_id.join(", ") : "";

    useEffect(() => {
        try {
            fetch(`http://127.0.0.1:8000/api/recommendations/${username?.username}/${joined}/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setRecommendations(result?.recommendations));
        }
        catch(error){alert('An error occurred. Please try again later.');}
    }, [])

    return(
        <>
            <div className = "recommendation-title">
                <p className = "ms-4 mt-3">Użytkownicy, którzy kupili ten produkt, kupili również: </p>
            </div>

            <div className = "recommendation-content-results">
                <ProductsWithRatings products = {recommended} />
            </div>
        </>
    );
}

export default Recommendations;
