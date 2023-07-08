import { useNavigate } from 'react-router-dom';



const MiniNavbar = () => {

    const navigate = useNavigate()

    const navigateTo = () => {
        navigate("");
    }

    return(
        <div className = "mini-navbar">
            <ul className = "">
                <li>Amazon.pl</li>
                <li>Okazje</li>
                <li>Prime Video</li>
                <li>Amazon Music</li>
                <li>Aplikacja Amazon</li>
            </ul>
        </div>
    )

}


export default MiniNavbar