import photo1 from './images/f2.jpg'
import photo2 from './images/oczyszczacz.jpg'
import photo3 from './images/wef.jpg'
import photo4 from './images/xd.jpg'


export default function GridBox(props){


    return(
            <div className = {`card-nbt ${props.class}`}>
                <div className = "home-header-card">
                    <h2 className = "cr-black fs-21 pt-4 fw-600">{props.boxTitle}</h2>
                </div>

                <div className = "home-body-card">

                    {props.list.map(
                            ((element, index) =>
                                <div key = {index}>
                                    <img src = {element[0]} />
                                    <span>{element[1]}</span>
                                </div>
                            )
                        )
                    }

                </div>

                <div className = "home-footer-card">
                    <a className = "standard-a">Zobacz więcej</a>
                </div>
            </div>

    );

}