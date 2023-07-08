
import React, {useEffect, useContext, useState} from 'react';
import AuthContext from "./AuthenticationContext";


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
    ajaxFunction: (num: number) => void;
    counterQuantities: (value: number) => void;
    quantity: number;
}


interface Data {
    done: boolean;
    product_id : number;
}


const CardObject: React.FC<Item> = ({ item, index, ajaxFunction, counterQuantities, quantity }) => {

    let {username} = useContext(AuthContext);
    const [data, setData] = useState<Data | null>(null);
    const [selectedValue, setSelectedValue] = useState<number>(quantity);

    const handleAjaxRequest = (num: number): void => {
        ajaxFunction(num);
    }

    const removeProduct = (index: number) => {
        
        try{
            fetch("http://127.0.0.1:8000/api/remove-item/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"id": index, "username": username?.user_id})
            })
            .then(response => response.json())
            .then(result => (setData(result)))  
        }

        catch(error){
            console.log("Error: ", error)
        }
    }


    const changeQuantity = (quantity: number) => {
        try{
            fetch("http://127.0.0.1:8000/api/cart/", {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({"id": index, "username": username?.user_id, "quantity": quantity})
            })
        }

        catch(error){
            console.log("Error: ", error)
        }
    }


    useEffect(() => {

        try{
            if(data?.done){
                const param = data.product_id;
                handleAjaxRequest(param);
            }
        }    

        catch{
            console.log("Not done")
        }

    }, [data])


    useEffect(() => {
        counterQuantities(selectedValue)
    }, [selectedValue])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(parseInt(e.target.value, 10));
        changeQuantity(parseInt(e.target.value, 10));
    };

    let statusColor: string;
    let status: string;

    if(item.quantity >= selectedValue){
        status = "Dostępny"
        statusColor = "text-success";
        console.log("green")
    }
    
    else {
        status = "Niedostępny"
        statusColor = "text-danger";
        console.log("dang")
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
                    
                    <select value={selectedValue} onChange={handleSelectChange}>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
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