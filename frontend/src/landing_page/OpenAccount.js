import React, {useState,useEffect} from 'react';

function OpenAccount() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Check login status from localStorage
    const flag = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(flag === "true");
  }, []);

    return ( 
        <div className="container p-5 mb-5">
            <div className="row text-center">
                
                <h1 className='mt-5'>Open a Zeroda Account</h1>
                <p>Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
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

export default OpenAccount;