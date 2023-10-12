import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MyAccountCardProps {
    title: string;
    image?: string | null;
    content: string
    alt?: string | undefined;
    link: string;
}

const MyAccountCard: React.FC<MyAccountCardProps> = ({ title, image, content, alt, link }) => {

    const navigate = useNavigate();

    const navigateTo = () => {
        navigate(`/account${link}`);
        window.location.reload();
    }

    if(image != null){
        return(
            <div onClick = {navigateTo} className = "my-account-card p-4">
                
                <div>
                    <img src = {image} loading = "lazy" width = "50" height = "50" alt = {alt} />
                </div>

                <div>
                    <span className = "link">{title}</span> <br/>
                    <span>{content}</span>                
                </div>

            </div>
        )
    }

    else {
        return(
            <div className = "my-account-card p-4">
                
                <div>
                </div>

                <div>
                    <span className = "link">{title}</span> <br/>
                    <span>{content}</span>                
                </div>

            </div>
        )
    }

}





export default MyAccountCard