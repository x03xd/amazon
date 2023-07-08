import React, { useEffect, useContext} from 'react';
import MyAccountCard from './MyAccountCard';
import { cardsData, cardsData2 } from "./static_ts_files/myAccountCards";
import AuthContext from "./AuthenticationContext";
import { useNavigate } from 'react-router-dom';



const MyAccount : React.FC = () => {


    let {username, authToken} = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if(authToken == null) navigate("/login/", {state: {link: 'http://127.0.0.1:8000/login/', inputValue: 'Dalej', style: 'active', style2: 'hidden', content: 'E-mail lub numer telefonu komórkowego'}});
    }, [])

    return(
        <div className = "my-account-content">
            
            <div></div>

            <div>
                <span>Moje konto</span>

                <div className = "my-account-cards-container mt-3">
                    {cardsData.map((item, index) => <MyAccountCard key = {index} title = {item.title} image = {item.image} content = {item.content} alt = {item.alt} link = {item.link} />)}
                </div>

                <br/><br/>
                <hr/>

                <div className = "my-account-cards-container second">
                    {cardsData2.map((item, index) => <MyAccountCard key = {index + 99} title = {item.title} content = {item.content} link = {item.link} />)}
                </div>

            </div>

            <div></div>


        </div>
    );

}







export default MyAccount;