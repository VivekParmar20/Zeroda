import React from "react";
const Team = () => {
  return (
    <div className="container">
      <div className="row p-5  ">
        <h1 className="text-center fs-3 text-muted">People</h1>
      </div>

      <div className="row text-muted fs-5" style={{ lineHeight: "1.8" }}>
        <div className="col-6 p-2 text-center">
          <img
            src="media\images\nithinKamath.jpg"
            alt=""
            style={{ borderRadius: "100%", width: "55%" }}
          />
          <h4 className="mt-5">Nithin Kamath</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-2">
          <p>Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry. </p>
          <p>He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC). </p>
          <p>Playing basketball is his zen.</p>
          <p>Connect on <a href="/about" style={{textDecoration:"none"}}> Homepage</a> / <a href="/about" style={{textDecoration:"none"}}>TradingQnA</a>  / <a href="/about" style={{textDecoration:"none"}}>Twitter</a> </p>
        </div>
      </div>
    </div>
  );
};
export default Team;
