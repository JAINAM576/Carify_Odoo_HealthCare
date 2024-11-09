
import React, { useEffect } from 'react';
import './LoaderAnimation.css';
import { cardio } from 'ldrs';
const LoaderAnimation = () => {
    useEffect(() => {
        cardio.register(); // Register the l-cardio component
    }, []);
    return (
        <>
            <div className='body'>
                    <l-cardio
                    size="230"
                    stroke="10"
                    speed="2"
                    color="white"
                ></l-cardio>
                <h3>Loading...</h3>
            </div>
        </>

    );
};

export default LoaderAnimation;
