
export default function Alert(props){

    console.log(props.style);



    return(
        <div className = {`alert-container-wrapper ${props.style}`}>
            <div className = "alert-container border border-danger rounded p-4 mt-2">
                <h4 className = "text-danger">Wystąpił błąd</h4>
                <span>{props.text}</span>
            </div>
        </div>
    );

}

