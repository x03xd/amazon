import { useState, useEffect, useRef, createContext } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';


const QueryParamsContext = createContext();

export default QueryParamsContext;


export const QueryParamsProvider = ({children}) => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    const c = searchParams.get("c");
    const q = searchParams.get("q");
    const u = searchParams.get("u");
    const u2 = searchParams.get("u2");
    const rating = searchParams.get("rating");


   // console.log(c, q, u, u2)

    let contextData2 = {
        c_QueryParam: c,
        q_QueryParam: q,
        u_QueryParam: u,
        rating_QueryParam: rating
    }


    return(
        <QueryParamsContext.Provider value = {contextData2}>
            {children}
        </QueryParamsContext.Provider>
    )

}
