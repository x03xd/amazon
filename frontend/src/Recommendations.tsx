import {useEffect, useState, useContext} from 'react';
import AuthContext from "./AuthenticationContext";
import ProductsWithRatings from './ProductsWithRatings';
import { ProductsInterface } from './static_ts_files/commonInterfaces';

interface RecommendationProps {
    product_id: string;
}

const Recommendations: React.FC<RecommendationProps> = ({ product_id }) => {

    const [recommended, setRecommendations] = useState<ProductsInterface[]>([]);
    const {username} = useContext(AuthContext);

    console.log(recommended)

    useEffect(() => {
        try {
            fetch(`http://127.0.0.1:8000/api/recommendations/${username?.username}/${product_id}/${username?.user_id}`)
            .then(response => response.json())
            .then(result => setRecommendations(result?.recommendations));
        }

        catch(error){alert('An error occurred. Please try again later.');}
    }, [])

    return(
        <div className = "recommendation-bar">
            <div className = "recommendation-title">
                <p>Użytkownicy, którzy kupili ten produkt, kupili również: </p>
            </div>

            <div className = "recommendation-content-results mt-3">
                <ProductsWithRatings products = {recommended} />
            </div>
        </div>
    );
}

export default Recommendations;
