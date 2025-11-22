import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    console.log("========================");
    console.log(token);
    console.log("========================");
    localStorage.setItem("dashboardToken", token);
  }
}, []);
  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
