import { IconDefinition, faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'


export interface StarStyling {
    icon: IconDefinition;
    style: string;
}

export interface StarStylingArray {
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
