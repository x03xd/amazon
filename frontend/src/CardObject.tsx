
import React, {useEffect, useContext, useState} from 'react';
import AuthContext from "./AuthenticationContext";
import { Navigate } from 'react-router-dom';
import { resourceLimits } from 'worker_threads';


interface Item {
    item: {
        brand: string;
        description: string;
        gallery1: boolean | null;
        gallery2: boolean | null;
        gallery3: boolean | null;
        id: number;
        image: string;
        price: number;
        quantity: number;
        status?: boolean | null;
        subcategory_name: number;
        title: string;
    }    
    index: number;
    ajaxFunction: (num: number) => void
}



interface Data {
    done: boolean;
    product_id : number;
}


const CardObject: React.FC<Item> = ({ item, index, ajaxFunction }) => {
    
   //console.log(indexInCart);
    let {username} = useContext(AuthContext);
    const [data, setData] = useState<Data | null>(null);

    const handleAjaxRequest = (num : number): void => {
        ajaxFunction(num);
    }


    const removeProduct = (index: number) => {
        try{
            const response = fetch("http://127.0.0.1:8000/api/remove-item/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"id": index, "username": username?.username})
            })
            .then(response => response.json())
            .then(result => (setData(result)))  
        }

        catch(error){
            console.log("Error: ", error)
        }
        
    }


    useEffect(() => {

        try{
            if(data?.done){
                console.log(data)
                handleAjaxRequest(data.product_id);
            }
        }    

        catch{
            console.log("Not done")
        }

    }, [data])


    let statusColor : string;
    let status: string;


    if(item.quantity >= 1){
        status = "Dostępny"
        statusColor = "text-success";
    }
    

    else {
        status = "Niedostępny"
        statusColor = "text-danger";
    }



    return(
        <>
            <div className = "card-content-objects-inner-col-1">
                <img width = "100" height = "100" loading = "lazy" alt = "" src= {item.image} />
            </div>


            <div className = "card-content-objects-inner-col-2">
                <div>
                    <span>{item.title}</span><br/>
                    <span className = {statusColor}>{status}</span>
                </div>

                <div className = "d-flex">
                    
                    <select>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10+</option>
                    </select>

                    <span onClick = {() => {removeProduct(index)}} className = "link">Usuń</span>
                </div>
            </div>


            <div className = "card-content-objects-inner-col-3">
                <span>{item.price}</span>
            </div>
        </>
    );
}

export default CardObject;