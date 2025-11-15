import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // styling file

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/login`,
      formData,
      { withCredentials: true } // ✅ cookie will be stored
    );

    if (res.data.msg === "Login successful") {
      alert("Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/"; // redirect to home or dashboard
    } else {
      alert(res.data.msg || "Invalid credentials!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error.response?.data?.msg || "Something went wrong!");
  }
};


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <a href="/signup">Register here</a>
      </p>
    </div>
  );
}

export default Login;
