import React from "react";

function RightSection({ imageURL, productName, productDescription, learnMore }) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left side - text */}
        <div className="col-6 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>

          <div className="mt-3">
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn more
            </a>
          </div>
        </div>

        {/* Right side - image */}
        <div className="col-6 text-center">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
