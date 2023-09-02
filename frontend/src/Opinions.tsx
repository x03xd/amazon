import React, { useState, useEffect} from 'react';
import SingleLobbyRate from './SingleLobbyRate'
import CountingRate from './CoutingRate';
import leftArrow from './images/left-arrow.png';
import user from './images/user.png'
import rightArrow from './images/right-arrow.png';

interface OpinionsProps {
    product_id: number;
}

interface Username {
    username: string;
}

interface Rate {
    id: number;
    rate: number;
    rated_products: number;
    rated_by: number;
}

interface Opinion {
    id: number;
    rate: Rate;
    title: string;
    text: string;
    reviewed_date: string;
    reviewed_product: string;
    reviewed_by: Username;
}

const Rating: React.FC<OpinionsProps> = ({ product_id }) => {

    const [opinions, setOpinions] = useState<Opinion[] | null>(null);
    const [pages, setPages] = useState<number>(0);

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/opinions/${product_id}/${pages}`)
            .then(response => response.json())
            .then(result => setOpinions(result));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [pages])

    const selectPage = (num: number) => {
        if(opinions?.length !== 5 && num > 0) return null;
        if(pages + num >= 0) {setPages(current_page => current_page + num)}
    }

    return(
        <div className = "lobby-opinions">  
            <div className = "lobby-opinions-rating-percentages">
                <SingleLobbyRate product_id = {product_id} />
            </div>

            <div className = "lobby-opinions-text">
            {(opinions !== null) ?
                opinions.length > 0 ?
                (<div className = "mx">
                    <img onClick = {() => selectPage(-5)} className = "mb-3 ms-3" width = "32" src = {leftArrow} alt = "left-arrow" loading = "lazy" />
                    <img onClick = {() => selectPage(5)} className = "mb-3 ms-3" width = "32" src = {rightArrow} alt = "left-arrow" loading = "lazy" />                      
                </div>)

                :
                (<div className = "no-opinions">
                    <span>Brak opinii klientów</span>
                </div>)
                : 
                <></>
            }

            <div className = "lobby-opinions-main">
                {Array.isArray(opinions)
                    ? opinions.map((opinion: Opinion, index: number) => (
                        <div className = "opinion" key = {index}>

                            <div className = "opinion-user-and-avatar">
                                <img src = {user} alt = "avatar" loading = "lazy" />
                                <span className = "opinion-reviewed-by-username">{opinion.reviewed_by.username}</span>
                            </div>
                        
                            <div className = "star-rating-container mt-3">
                                <CountingRate rate = {opinion.rate.rate} style = "" />
                                <span className = "opinion-title">{opinion.title}</span>
                            </div>
                                
                            <span className = "opinion-date">Opinia napisana dnia: {opinion.reviewed_date}</span>
                            <br/>
                            <span className = "verified-order">Zweryfkowany zakup</span>
                            <br/>
                                
                            <div className = "opinion-text-container mt-3">
                                <span className = "opinion-text">{opinion.text}</span>
                            </div>
                        </div>
                    ))
                    : <></>
                    }
                </div>
            </div>

            <div>
            </div>
        </div>
    );

}

export default Rating;