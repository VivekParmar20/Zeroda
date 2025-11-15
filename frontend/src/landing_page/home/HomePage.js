import React from 'react';
import OpenAccount from '../OpenAccount';
import Hero from './Hero';
import Awards from './Awards';
import Pricing from './Pricing';
import Education from './Education';
import Stats from './Stats';


function HomePage() {
    return ( 
        <>
            
            <Hero />
            <Awards />
            <Stats />
            <Pricing /> 
            <Education />
            <OpenAccount />
           
        </>
     );
}

export default HomePage;