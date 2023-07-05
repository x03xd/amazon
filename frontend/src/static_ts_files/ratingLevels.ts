
interface Right {
    [key: string] : number;
}


interface Destination {
    final: [string, Right];
};


interface RatingStars {
    array: string[]
}


const ratingLevels: Destination["final"][] = [
    ["4 and more", {"key": 4}],
    ["3 and more", {"key": 3}],
    ["2 and more", {"key": 2}],
    ["1 and more", {"key": 1}],
]   

const ratingStars : RatingStars["array"][] = [
    ["first", ""],
    ["second", ""],
    ["third", ""],
    ["fourth", ""],
    ["fifth", ""]
]


export {ratingStars, ratingLevels}