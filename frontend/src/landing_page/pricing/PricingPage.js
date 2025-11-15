import React from "react";  

import Hero from "./Hero";    
import OpenAccount from "../OpenAccount";
import Brokerage from "./Brokerage";    

function PricingPage() {
    return(
        <>
            <Hero></Hero>
            <OpenAccount />
            <Brokerage></Brokerage>
        </>
    );
}
export default PricingPage;