







export default function List(props){


    return(
        <>
            <li key = {props.index}>
                {props.item}
            </li>
        </>
    );

}