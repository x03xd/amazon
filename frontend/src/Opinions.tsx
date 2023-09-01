import React, { useState, useEffect} from 'react';
import SingleLobbyRate from './SingleLobbyRate'

interface OpinionsProps {
    product_id: number;
}

interface Username {
    username: string;
}

interface Opinion {
    id: number;
    rate: number;
    title: string;
    text: string;
    reviewed_date: string;
    reviewed_product: string;
    reviewed_by: Username;
}

const Rating: React.FC<OpinionsProps> = ({ product_id }) => {

    const [opinions, setOpinions] = useState<Opinion[]>([]);

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/opinions/${product_id}`)
            .then(response => response.json())
            .then(result => setOpinions(result));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [])

    return(
        <div className = "lobby-opinions">  
            <div className = "lobby-opinions-rating-percentages">
                <SingleLobbyRate product_id = {product_id} />
            </div>
            
            <div className = "lobby-opinions-main">
            {Array.isArray(opinions)
                ? opinions.map((opinion: Opinion, index: number) => (
                    <div key = {index}>
                        <p className = "opinion-reviewed_by-username">{opinion.reviewed_by.username}</p>
                        <span className = "opinion-title">{opinion.title}</span>
                        <br />
                        <span className = "opinion-text">{opinion.text}</span>
                    </div>
                    
                    ))

                    :(
                        <></>
                    )}
            </div>

            <div>
            </div>
        </div>
    );

}

export default Rating;