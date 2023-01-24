
import React from 'react';


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
}




const CardObject: React.FC<Item> = ({ item }) => {
    
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
            </div>


            <div className = "card-content-objects-inner-col-2">
                <div>
                    <span className = "">{item.title}</span><br/>
                    <span className = {`fs-12 ${statusColor}`}>{status}</span>
                </div>

                <div className = "d-flex">
                    <input className = "" type = "text" />
                    <a href = "">Usuń</a>
                </div>
            </div>


            <div className = "card-content-objects-inner-col-3">
                <span className = "fw-600">{item.price}</span>
            </div>


        </>
    );
}

export default CardObject;