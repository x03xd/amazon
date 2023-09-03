import React from "react";


const Payments: React.FC = () => {

	async function payIt(e: React.FormEvent<HTMLFormElement>){
		e.preventDefault()
		console.log("payIt")
        
        try{
            const response = await fetch("http://127.0.0.1:8000/api/payment-creation/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({})
            })
            const responseJSON = await response.json()
			
			if(responseJSON.link){
				window.location.href = responseJSON.link
			}

        }
        catch(error){console.log(error);}
    }


	return (
		<div>
			<div className='product'>
				<img
					src='https://i.imgur.com/EHyR2nP.png'
					alt='The cover of Stubborn Attachments'
				/>
				<div className='description'>
					<h3>Stubborn Attachments</h3>
					<h5>$20.00</h5>
				</div>
			</div>

			<form onSubmit = {payIt} method='POST'>
				<button className='button' type='submit'>
					Checkout
				</button>
			</form>
		</div>
	);
};

export default Payments;