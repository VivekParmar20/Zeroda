import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import axios from "axios";
import "./Signup.css"; // we'll add styles here

function Signup() {
  const navigate = useNavigate(); // initialize navigate
  const [formData, setFormData] = useState({
    username: "",
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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, formData);
      console.log("hello");   
      alert(res.data.msg || "Registered successfully!");
      navigate("/login"); // redirect to login page
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleChange}
          required
        />

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

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
