import React from 'react';


interface MyAccountCardProps {
    title: string;
    image?: string | null;
    content: string
    alt?: string | null;
}



const MyAccountCard: React.FC<MyAccountCardProps> = ({ title, image, content, alt }) => {

if(image != null)
    return(
        <div className = "my-account-card p-4">
            
            <div>
                <img src = {image} loading = "lazy" width = "50" height = "50" alt = {alt}/>
            </div>

            <div>
                <span>{title}</span> <br/>
                <span>{content}</span>                
            </div>

        </div>
    )



else {
    return(
        <div className = "my-account-card p-4">
            
            <div>
     
            </div>

            <div>
                <span>{title}</span> <br/>
                <span>{content}</span>                
            </div>

        </div>
    )
}









export default MyAccountCard;