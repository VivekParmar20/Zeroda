import React , { useEffect, useState } from "react";


const Universe = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Check login status from localStorage
    const flag = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(flag === "true");
  }, []);

  return (
    <div className="container mt-5">
      {/* Heading section */}
      <div className="text-center mb-5">
        <h1>The Zerodha Universe</h1>
        <p className="text-muted">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>
      </div>

      {/* First row */}
      <div className="row text-center">
        <div className="col-4 p-3">
          <img
            src="media/images/zerodhaFundhouse.png"
            alt="Zerodha Fundhouse"
            className="img-fluid mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <p className="text-muted small">
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>

        <div className="col-4 p-3">
  <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: "80px" }}>
    <img
      src="media/images/sensibullLogo.svg"
      alt="Sensibull"
      style={{ maxHeight: "60px", objectFit: "contain" }}
    />
  </div>
  <p className="text-muted small">
    Options trading platform that lets you create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.
  </p>
</div>


        <div className="col-4 p-3">
          <img
            src="media/images/goldenpiLogo.png"
            alt="GoldenPi"
            className="img-fluid mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <p className="text-muted small">
            Investment research platform that offers detailed insights on
            stocks, sectors, supply chains, and more.
          </p>
        </div>
      </div>

      {/* Second row */}
      <div className="row text-center mt-4">
        <div className="col-4 p-3">
          <img
            src="media/images/streakLogo.png"
            alt="Streak"
            className="img-fluid mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <p className="text-muted small">
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>

        <div className="col-4 p-3">
          <img
            src="media/images/dittoLogo.png"
            alt="Ditto"
            className="img-fluid mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <p className="text-muted small">
            Personalized advice on life and health insurance. No spam and no
            mis-selling.
          </p>
        </div>

        <div className="col-4 p-3">
  {/* Fixed-height flex box for consistent logo alignment */}
  <div
    className="d-flex justify-content-center align-items-center mb-3"
    style={{ height: "80px" }}
  >
    <img
      src="media/images/smallcaseLogo.png"
      alt="Smallcase"
      style={{ maxHeight: "60px", objectFit: "contain" }}
    />
  </div>
  <p className="text-muted small">
    Thematic investing platform that helps you invest in diversified
    baskets of stocks or ETFs.
  </p>
</div>

        {!isLoggedIn && (
          <button
            className="p-2 fs-5 btn btn-primary mb-5"
            style={{ margin: "0 auto", width: "20%", color: "white" }}
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up Now
          </button>
        )}
      </div>
    </div>
  );
};

export default Universe;
