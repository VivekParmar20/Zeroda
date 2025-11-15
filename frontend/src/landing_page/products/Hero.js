import React from "react";
const Hero = () => {
  return (
    <div className="container border-bottom mb-5">
      <div className="text-center mt-5 p-3 mb-5">
      <h2>Zerodha Products</h2>
      <h3 className="text-muted mt-3 fs-4">Sleek, modern, and intuitive trading platforms </h3>
      <p className="mt-3 mb-5">Check out our <a href="/product" style={{textDecoration:"none"}}>investment offerings <i class="fa-solid fa-arrow-right"> </i></a></p> 
    </div>
    </div>
  );
};
export default Hero;