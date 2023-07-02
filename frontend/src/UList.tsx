

import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";


export interface UListProps {
    index: number;
    item: string;
    UListFunction: (item: string) => void;
}


const UList: React.FC<UListProps> = ({ index, item, UListFunction }) => {

    function handleClick(item: string){
        UListFunction(item);
    }

    return(
        <>
            <li key = {index} onClick = {() => {handleClick(item)}} >
                {item}
            </li>
        </>
    );
}


export default UList;