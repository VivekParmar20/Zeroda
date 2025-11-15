import React from "react";

const LeftSection = ({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) => {
  return (
    <div className="container mt-5">
      <div className="row ">
        <div className="col-6 ">
          <img src={imageURL} alt="" />
        </div>
        
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          
          <div className="mt-3" >
            
              <a href={tryDemo} style={{textDecoration:"none"}} >Try Demo</a>
            
            <a href={learnMore} style={{marginLeft:"120px", textDecoration:"none"}}>learn more</a>
          </div>
          <div className="mt-3" >
            <a href={googlePlay}>
              <img src="media\images\googlePlayBadge.svg" alt="" />
            </a>
            <a href={appStore}>
              <img src="media\images\appstoreBadge.svg" style={{marginLeft:"50px"}} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeftSection;
