
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
 import { faStar } from '@fortawesome/free-solid-svg-icons'


export default function Rating(props){


    const ratingLevels = [
        ["4 and more", {"key": 4}],
        ["3 and more", {"key": 3}],
        ["2 and more", {"key": 2}],
        ["1 and more", {"key": 1}]
    ];


    const ratingStars = [
        ["first", null],
        ["second", null],
        ["third", null],
        ["fourth", null],
        ["fifth", null]
    ]


    return(
        <>
                {ratingLevels.map((row, index) => {

                    for(let i = 0; i <= 4; i++){
                        ratingStars[i][1] = "";
                    }

                    for(let i = 0; i <= ratingLevels[index][1]["key"] - 1; i++){
                        ratingStars[i][1] = "ranked-up";
                    }


                    return(
                        <div key = {index} className = "star-rating-container mt-1">

                            {ratingStars.map((star, key) => {

                                return(
                                    <div key = {key} className = {ratingStars[key][1]}>
                                        <FontAwesomeIcon icon = {faStar} className = "star-rating-icon" />
                                    </div>
                                );

                            })}

                            <span>i więcej</span>
                        </div>
                    );

                })}
        </>
    );

}