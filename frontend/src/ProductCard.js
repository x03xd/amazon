import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState, useRef, useEffect} from 'react';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import {useLocation} from 'react-router-dom';

export default function ProductCard(props){

    const navigate = useNavigate();
    const location = useLocation();

    const [rateRange, setRateRange] = useState(2);

    function handleClick(){

        let slug = props.item.description.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

        navigate(`/l/${slug}`, {state: {id_product: props.item.id, image: props.item.image, desc: props.item.description, price: props.item.price
        , g1: props.item.gallery1, status: props.item.quantity, brand: props.item.brand, slug: slug}})
    }

  //  console.log(props.rate, props.item.brand);



    useEffect(() => {
        if(props.rate <= 5 && props.rate >= 4.76){
               setRateRange(0);
               // starStyling[0].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

        else if(props.rate <= 4.75 && props.rate >= 4.26){
            setRateRange(1);
             //   starStyling[1].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

        else if(props.rate <= 4.25 && props.rate >= 3.76){

            setRateRange(2);
             //   starStyling[2].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 3.75 && props.rate >= 3.26){

            setRateRange(3);
               // starStyling[3].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 3.25 && props.rate >= 2.76){

            setRateRange(4);
             //   starStyling[4].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 2.75 && props.rate >= 2.26){

            setRateRange(5);
              //  starStyling[5].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 2.25 && props.rate >= 1.76){

            setRateRange(6);
               // starStyling[6].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 1.75 && props.rate >= 1.26){

            setRateRange(7);
               // starStyling[7].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 1.25 && props.rate >= 0.76){

            setRateRange(8);
               // starStyling[8].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 0.75 && props.rate >= 0.26){

            setRateRange(9);
             //   starStyling[9].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)

        }

        else if(props.rate <= 0.25){

            setRateRange(10);
                //starStyling[10].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />)
        }

    }, [])

  //  console.log(rateRange)

    const starStyling = [
    /*1*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}],
    /*2*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}],
    /*3*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}],
    /*4*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}],
    /*5*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*6*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*7*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*8*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*9*/    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*10*/   [{icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    /*11*/   [{icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    ]



    //console.log(starStyling[2].map((item, index) => <FontAwesomeIcon key = {index} icon = {item.icon} className = "star-rating-icon-small" />));
//<FontAwesomeIcon icon={faStarHalfStroke} className = "star-rating-icon" />

    return(
        <div className = "product-card-content">
            <div>
                <img loading = "lazy" width = "288" height = "234" className = "p-3" src = {props.item.image} />
            </div>

            <div className = "ps-3 pt-3">
                <span onClick = {handleClick} className = "a-text-normal">{props.item.description.substring(0, 150)}...</span>
            </div>

            <div className = "star-rating-container p-3">
                {starStyling[rateRange].map((item, index) => (<div key = {index} className = {item.style}><FontAwesomeIcon icon = {item.icon} className = "star-rating-icon-small" /></div>) )}
            </div>

            <div className = "ps-3 pb-3">
                <p className = "fw-500">{props.item["price"]}</p>
                <span>Dostawa do dnia:</span><br/>
                <span>DARMOWA dostawa przez Amazon</span>
            </div>
        </div>
    );

}



