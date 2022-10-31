import GridBox from './GridBox.js';
import photo1 from './images/f2.jpg';
import photo2 from './images/oczyszczacz.jpg';
import photo3 from './images/wef.jpg';
import photo4 from './images/xd.jpg';

import yellow1 from './images/yellow1.jpg';
import yellow2 from './images/yellow2.jpg';
import yellow3 from './images/yellow3.jpg';
import yellow4 from './images/yellow4.jpg';

import Banner from './Banner';

export default function Main(props){

    const dlaTwojegoDomu = [
        [photo1, 'Oczyszczacze powietrza'],
        [photo2, 'Nawilżacze powietrza'],
        [photo3, 'Ogrzewanie'],
        [photo4, 'Części i akcesoria'],
    ];


    const nowyEchoDot = [
        [yellow1, 'Nowy Echo Dot'],
        [yellow2, 'Kindle Paperwhite'],
        [yellow3, 'Kindle Oasis'],
        [yellow4, 'Fire TV Stick']
    ];



    return(
        <div className = "home-content">
            <Banner />

            <GridBox boxTitle = 'Dla twojego domu' list = {dlaTwojegoDomu} class = 'ms-4'  />
            <GridBox boxTitle = 'Urządzenia Amazon' list = {nowyEchoDot} class = '' />

            <GridBox boxTitle = 'Dla twojego domu' list = {dlaTwojegoDomu} class = '' />
            <GridBox boxTitle = 'Urządzenia Amazon' list = {nowyEchoDot} class = 'me-4' />


        </div>

    );


}