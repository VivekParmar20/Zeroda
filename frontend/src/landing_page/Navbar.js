import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);
  //  useEffect(()=>{
  //   handleDashboard();
  // },[])

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
const handleDashboard = () => {
  const url = `${process.env.REACT_APP_DASHBOARD_URL}`;
  window.open(url, "_self");
};


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="media/images/logo.svg" alt="Logo" style={{ width: "25%" }} />
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Signup
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">
                Support
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleDashboard}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
