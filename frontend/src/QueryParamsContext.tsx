import React, { createContext } from 'react';
import {useSearchParams} from 'react-router-dom';


interface ContextProvider {
    children: React.ReactNode
}


interface InitialValuesTypes {
    c_QueryParam: null | string;
    q_QueryParam: null | string;
    u_QueryParam: null | string;
    rating_QueryParam: null | string;
}


const initialValues = {
    c_QueryParam: null,
    q_QueryParam: null,
    u_QueryParam: null,
    rating_QueryParam: null,
}


const QueryParamsContext = createContext<InitialValuesTypes>(initialValues);

export default QueryParamsContext;

export const QueryParamsProvider = ({children} : ContextProvider) => {

    const [searchParams] = useSearchParams();
            
    let contextData2 = {
        c_QueryParam: searchParams.get("c"),
        q_QueryParam: searchParams.get("q"),
        u_QueryParam: searchParams.get("u"),
        rating_QueryParam: searchParams.get("rating")
    }

    return(
        <QueryParamsContext.Provider value = {contextData2}>
            {children}
        </QueryParamsContext.Provider>
    )

}
