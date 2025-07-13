import React from 'react';
import PhotoBooth from './PhotoBooth';
import './Hero.css';
import Webcam from 'react-webcam';

const Hero = () => {
    return (
        <div className='hero'>
            <PhotoBooth />
        </div>
    )
}
export default Hero;