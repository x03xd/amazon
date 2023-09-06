import React, { useState, useEffect, useRef} from 'react';
import SingleLobbyRate from './SingleLobbyRate'
import CountingRate from './CoutingRate';
import leftArrow from './images/left-arrow.png';
import user from './images/user.png'
import rightArrow from './images/right-arrow.png';
import deletebutton from './images/deletebutton.png'

interface OpinionsProps {
    product_id: number;
    user_id: number;
}

interface Username {
    username: string;
    id: number;
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

const Rating: React.FC<OpinionsProps> = ({ product_id, user_id }) => {

    const [opinions, setOpinions] = useState<Opinion[] | null>(null);
    const [pages, setPages] = useState<number>(0);

    const textAreaValue = useRef<HTMLTextAreaElement | null>(null);
    const inputTitleValue = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        try{
            fetch(`http://127.0.0.1:8000/api/opinions/${product_id}/${pages}`)
            .then(response => response.json())
            .then(result => setOpinions(result));
        }
        catch(error){ alert("Opinions cannot be displayed"); }
    }, [pages])


    async function sendOpinion(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
       
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/opinion-create/${user_id}/${product_id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"text": textAreaValue.current?.value, "title": inputTitleValue.current?.value})
            })
            const responseJSON = await response.json()
            console.log(responseJSON)

            if(responseJSON?.status){
                window.location.reload()
            }
    
            else {
                alert(responseJSON?.detail)
            }
        }
        catch(error){alert(error);}
    }

    async function removeOpinion(opinion_number: number){
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/opinion-remove/${opinion_number}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({})
            })
            const responseJSON = await response.json()
            console.log(responseJSON)

            if(responseJSON?.status){
                window.location.reload()
            }
    
            else {
                alert(responseJSON?.detail)
            }
        }
        catch(error){alert(error);}
    }

    const selectPage = (num: number) => {
        if(opinions?.length !== 5 && num > 0) return null;
        if(pages + num >= 0) {setPages(current_page => current_page + num)}
    }

    return(
        <div className = "lobby-opinions">  
            <div className = "lobby-opinions-rating-percentages">
                <SingleLobbyRate product_id = {product_id} user_id = {user_id}/>
            </div>

            <div className = "lobby-opinions-text">
            {(opinions !== null) ?
                opinions.length > 0 ?
                (<div className = "mx">
                    <img onClick = {() => selectPage(-5)} className = "mb-3 ms-3 cursor-finger" width = "32" src = {leftArrow} alt = "left-arrow" loading = "lazy" />
                    <img onClick = {() => selectPage(5)} className = "mb-3 ms-3 cursor-finger" width = "32" src = {rightArrow} alt = "left-arrow" loading = "lazy" />                      
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
                                {
                                    user_id === opinion.reviewed_by.id ? <img className = "cursor-finger" src = {deletebutton} loading = "lazy" alt = "remove" onClick = {() => {removeOpinion(opinion.id)}} />: <></>
                                }
                            </div>
                        
                            <div className = "star-rating-container mt-3">
                                <CountingRate rate = {opinion?.rate?.rate} />
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

                <div className = "lobby-opinions-comment mt-5">
                    <div className = "lobby-opinions-comment-input">
                        <form onSubmit = {sendOpinion}>
                            <input className = "text-input" placeholder = "Tytuł..." id="user_comment-title" type = "text" ref = {inputTitleValue} />
                            <textarea className = "text-input" id="user_comment" name="user_comment" ref = {textAreaValue}></textarea>
                            <button className = "login-button mt-3" type="submit">Wyślij</button>
                        </form>
                    </div>
                </div>

            </div>

            <div>
            </div>
        </div>
    );

}

export default Rating;