import React from 'react';
import MyAccountCard from './MyAccountCard';
import { cardsData, cardsData2, CardData, CardData2 } from "./static_ts_files/myAccountCards";



const MyAccount : React.FC = () => {


    return(
        <div className = "my-account-content">
            
            <div></div>

            <div>
                <span>Moje konto</span>

                <div className = "my-account-cards-container mt-3">
                    {cardsData.map((item: CardData, index: number) => <MyAccountCard key = {index} title = {item.title} image = {item.image} content = {item.content} alt = {item.alt} link = {item.link} />)}
                </div>

                <br/><br/>
                <hr/>

                <div className = "my-account-cards-container second">
                    {cardsData2.map((item: CardData2, index: number) => <MyAccountCard key = {index + 99} title = {item.title} content = {item.content} link = {item.link} />)}
                </div>

            </div>

            <div></div>


        </div>
    );

}


export default MyAccount;