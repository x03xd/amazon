import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'


interface StarStyling {
    icon: unknown;
    style: string;
}


interface StarStylingArray {
    array: StarStyling[];
}


const starStyling : StarStylingArray["array"][] = [
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStarHalfStroke, style: "yellow-filled"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
    [{icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}, {icon: faStar, style: "lightgrey-empty"}],
]


export {starStyling};
