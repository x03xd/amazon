import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import React from 'react';
import carousel1 from './images/carousel1.jpg'
import carousel2 from './images/carousel2.jpg'
import carousel3 from './images/carousel3.jpg'
import carousel4 from './images/carousel4.jpg'
import carousel5 from './images/carousel5.jpg'


const Banner: React.FC = () => {

    return(
        <div className = "card-banner position-relative">

            <Carousel
                autoPlay
                infiniteLoop
                showStatus = {false}
                showIndicators = {false}
                showThumbs = {false}
                interval = {5000}
            >

                <div>
                    <img loading = 'lazy' src = {carousel1} alt = "carousel1" />
                </div>

                <div>
                    <img loading = 'lazy' src = {carousel2} alt = "carousel2" />
                </div>

                <div>
                    <img loading = 'lazy' src = {carousel3} alt = "carousel3" />
                </div>

                <div>
                    <img loading = 'lazy' src = {carousel4} alt = "carousel4" />
                </div>

                <div>
                    <img loading = 'lazy' src = {carousel5}alt = "carousel5" />
                </div>

            </Carousel>
            <div className = "gradient-banner w-100 position-absolute bottom-0"></div>
        </div>
    );

}

export default Banner;