import Banner from './Banner';
import { useState, useEffect } from 'react';

export default function Store(props){


        const [data, setData] = useState(null);

        useEffect(() => {
            fetch("https://fakestoreapi.com/products")
            .then(response=>response.json())
            .then(result => setData(result));
        },[]
        )

        console.log({data})

        return(
            <div>




            </div>
        );
}