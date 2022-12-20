





export default function CardObject(props){

    let status = props.item.quantity
    let statusColor;

    if(status >= 1){
        status = "Dostępny"
        statusColor = "text-success";
    }

    else {
        status = "Niedostępny"
        statusColor = "text-danger";
    }


    return(
        <>
            <div className = "card-content-objects-inner-col-1">
            </div>


            <div className = "card-content-objects-inner-col-2">
                <div>
                    <span className = "">{props.item.title}</span><br/>
                    <span className = {`fs-12 ${statusColor}`}>{status}</span>
                </div>

                <div className = "d-flex">
                    <input className = "" type = "text" />
                    <a href = "">Usuń</a>
                </div>
            </div>


            <div className = "card-content-objects-inner-col-3">
                <span className = "fw-600">{props.item.price}</span>
            </div>


        </>
    );
}