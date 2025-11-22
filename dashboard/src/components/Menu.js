import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [user, setUser] = useState(null);

  // 1) Save token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("dashboardToken", token);
    }
  }, []);

  // 2) Fetch user using cookie auth
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/me`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("dashboardToken");
      window.location.href = process.env.REACT_APP_FRONTEND_URL;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="" />

      <div className="menus">
        <ul>
          <li>
            <Link to="/" onClick={() => setSelectedMenu(0)}>
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" onClick={() => setSelectedMenu(1)}>
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" onClick={() => setSelectedMenu(2)}>
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" onClick={() => setSelectedMenu(3)}>
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link to="/funds" onClick={() => setSelectedMenu(4)}>
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <a
              href={process.env.REACT_APP_FRONTEND_URL}
              onClick={() => setSelectedMenu(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Home
              </p>
            </a>
          </li>
        </ul>

        <hr />

        <div className="profile">
          <div className="avatar" style={{ width: "40px" }} onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
