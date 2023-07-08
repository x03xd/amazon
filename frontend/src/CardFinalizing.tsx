import AuthContext from "./AuthenticationContext";
import React from 'react';

interface Num {
    num: number;
    total: number;
}

const CardFinalizing : React.FC<Num> = ({ num, total }) => {

    const {username} = React.useContext(AuthContext);

    const finalizeOrder = async () => {

        try{
            const response = await fetch(`http://127.0.0.1:8000/api/finalize-order/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({"location": "cart", "quantity":1, "user": username?.user_id})
            })

            const data = await response.json()
            console.log(data)
        }

        catch (error) {
            console.error('Error updating token:', error);
        }

    
    }



    return(
        <div className = "cart-finalizing-container bg-light">

            <div className = "cart-finalizing-container-sideL"></div>

            <div className = "cart-finalizing-container-main">
                <div className = "p-3 pt-4">
                    <span className = "text-success">Niektóre przedmioty w zamówieniu kwalifikują się do DARMOWEJ dostawy. Wybierz tę opcję przy kasie. Obowiązują ograniczenia</span>
                </div>


                <div className = "p-3">
                    <span>Suma: (ilość produktów wynosi: {num}):{'\u00a0'}{'\u00a0'}<span className = "fw-600">{total}</span></span> 
                </div>

                <div className = "pe-3">
                    <input type = "checkbox" />
                    
                    <span>Zamów jako prezent / wyślij z dedykacją</span>
                </div>

                <div className = "pb-5 pt-3">
                    <input onClick = {finalizeOrder} type = "button" id = "finalize-cart" className = "bg-warning" value = "Przejdź do finalizacji zamówienia" />
                </div>
            </div>  

            <div className = "cart-finalizing-container-sideP"></div>

        </div>
    )

}









export default CardFinalizing;