import {useNavigate} from 'react-router-dom';
import AuthContext from "./AuthenticationContext";
import React from 'react';

interface HashMap {
    [key: string]: boolean;
}

interface Nums {
    num: number;
    total: number;
    buyButton: HashMap
}

const CardFinalizing : React.FC<Nums> = ({ num, total, buyButton }) => {

    const {username} = React.useContext(AuthContext);
    const navigate = useNavigate();

    const finalizeOrder = async () => {

        if(buyButton && buyButton?.size === undefined){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/finalize-order/`, {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({"location": "cart", "user": username?.user_id})
                })
                const responseJSON = await response.json()

                if(responseJSON?.status) navigate("/")

                else alert(responseJSON)

            }

            catch(error){alert('An error occurred. Please try again later.');}
        }
    }


    return(
        <div className = "cart-finalizing-container bg-light">

            <div className = "cart-finalizing-container-sideL"></div>

            <div className = "cart-finalizing-container-main">
                <div className = "p-3 pt-4">
                    <span className = "green-text text-success">Niektóre przedmioty w zamówieniu kwalifikują się do DARMOWEJ dostawy. Wybierz tę opcję przy kasie. Obowiązują ograniczenia</span>
                </div>


                <div className = "p-3">
                    <span>Suma: (ilość produktów wynosi: {num}):{'\u00a0'}{'\u00a0'}<span className = "fw-600">{total}</span></span> 
                </div>

                <div className = "pe-3">

                </div>

                <div className = "pb-5 pt-3">
                    { (Object.keys(buyButton).length === 0)
                     ?
                     <input onClick = {finalizeOrder} type = "button" id = "finalize-cart" className = "bg-warning" value = "Przejdź do finalizacji zamówienia" />
                     : 
                     <input disabled type = "button" id = "finalize-cart" className = "bg-danger" value = "Przejdź do finalizacji zamówienia" />
                    }
                    
                </div>
            </div>  

            <div className = "cart-finalizing-container-sideP"></div>

        </div>
    )

}




export default CardFinalizing;