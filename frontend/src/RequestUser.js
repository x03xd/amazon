

import { useState, useEffect, useRef } from 'react';


export default function RequestUser(){


    const [key, setKey] = useState(null);

    useEffect(() => {
        let response = fetch("http://127.0.0.1:8000/api/get-user/", {
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