

import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";


export interface UListProps {
    key: number;
    item: string;
    UListFunction: (item: string) => void;
}



const UList: React.FC<UListProps> = ({ key, item, UListFunction }) => {

    function handleClick(item: string){
        UListFunction(item);
    }

    return(
        <>
            <li key = {key} onClick = {() => {handleClick(item)}} >
                {item}
            </li>
        </>
    );
}


export default UList;