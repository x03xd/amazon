import arrow from './images/left.png';
import PropTypes from 'prop-types';
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";


export default function Clear(props){
    const navigate = useNavigate();
        const [searchParams, setSearchParams] = useSearchParams();
            const c = searchParams.get("c");
            const q = searchParams.get("q");
            const u = searchParams.get("u");
            const u2 = searchParams.get("u2");

    function clearResults(){

        switch (props.nut) {

            case "c":
                navigate(`?q=${q}&c=${null}&u=${u}&u2=${u2}`);
                props.func("c");
                break;

            case "u":
                navigate(`?q=${q}&c=${c}&u=${null}&u2=${null}`);
                props.func("u");
                break;

        }

    }


    return(
        <div onClick = {() => { clearResults(); }} className = "d-flex align-items-center ms-n2 cursor-pointer">
            <img src = {arrow}/><span className = "cursor-pointer">{props.text}</span>
        </div>
    );

}

Clear.defaultProps = {
    text: "Wyczyść",
  //  onClick: () => {
  //      clearResult
  //  }
}