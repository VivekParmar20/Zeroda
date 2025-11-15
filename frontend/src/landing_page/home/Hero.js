import React, { useEffect, useState } from "react";

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Check login status from localStorage
    const flag = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(flag === "true");
  }, []);

  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Hero IMG"
          className="mb-5"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        <h1 className="mt-5">Invest In Everything</h1>
        <p>
          Online platform to invest in stocks, derivatives, mutual funds, ETFs,
          bonds, and more.
        </p>

        {/* ✅ Only show the button if NOT logged in */}
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
}

export default Hero;
