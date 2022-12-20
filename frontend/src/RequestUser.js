

import { useState, useEffect, useRef } from 'react';


export default function RequestUser(){


    const [key, setKey] = useState(null);

    useEffect(() => {
        let response = fetch("http://localhost:3000/get-user/", {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type':'application/json',

                    },
                })
            .then(response => response.json())
            .then(result => console.log(result))
    }, [])


    return(<></>);

}