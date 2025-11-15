import React from "react";
const Hero = () => {
  return (
    <div className="container">
      <div className="row p-5 mt-5 text-center mt-3 text-small fs-4">
      <h3>Charges</h3>
      <p className=" text-muted ">List of all charges and taxes</p>
      </div>
      <div className="row text-center p-5 ">
        <div className="col-4 p-4">
          <img src="media/images/pricingEquity.svg" style={{height:"40%"}} alt="" />
          <h1 className="fs-3 ">Free equity delivery</h1>
          <p className="text-muted">All equity delivery investments (NSE, BSE), are absolutely free — ₹ 0 brokerage. </p>
        </div>
        <div className="col-4 p-4">
          <img src="media/images/intradayTrades.svg" style={{height:"40%"}} alt="" />
          <h1 className="fs-3 ">Intraday and F&O trades</h1>
          <p className="text-muted">Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.</p>
        </div>
        <div className="col-4 p-4">
            <img src="media/images/pricingEquity.svg" style={{height:"40%"}} alt="" />
            <h1 className="fs-3 ">Free direct MF</h1>
            <p className="text-muted">All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges. </p>
        </div>
      </div>
    </div>
  );
};
export default Hero;