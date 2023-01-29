import React from "react";
import MyAccountCard from './MyAccountCard'
import { cardsData, cardsData2 } from "./static_ts_files/myAccountCards";



const MyAccount : React.FC = () => {


    return(
        <div className = "my-account-content mt-5">
            
            <div></div>

            <div>
                <span>Moje konto</span>

                <div className = "my-account-cards-container mt-3">
                    {cardsData.map((item, index) => <MyAccountCard key = {index} title = {item.title} image = {item.image} content = {item.content} alt = {item.alt} />)}
                </div>

                <br/>

                <div className = "my-account-cards-container mt-3">
                    {cardsData2.map((item, index) => <MyAccountCard key = {index + 99} title = {item.title} content = {item.content} />)}
                </div>

            </div>

            <div></div>


        </div>
    );

}







export default MyAccount;