import React, { useState } from "react";

import { Link } from "react-router-dom";

import  { useEffect } from "react";

import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

const [user, setUser] = useState(null);
  
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/me`, { withCredentials: true }) // ✅ check if logged in
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`// back to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }}  alt=""/>
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <a
              href={process.env.REACT_APP_FRONTEND_URL}
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(6)}
            >
            <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Home
            </p>
            </a>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar" style={{ width: "40px" }} onClick={handleLogout}>Logout</div>
          {/* <p className="username">USERID</p> */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
