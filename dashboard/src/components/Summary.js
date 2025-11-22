import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

const Summary = () => {
  const THRESHOLD = 3740;

  const [funds, setFunds] = useState({
    openingBalance: THRESHOLD,
    totalInvestment: 0,
    currentValue: 0,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/allHoldings`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("dashboardToken"),
        },
      })
      .then((res) => {
        const holdings = res.data || [];

        const totalInvestment = holdings.reduce(
          (sum, s) => sum + (s.avg || 0) * (s.qty || 0),
          0
        );

        const currentValue = holdings.reduce(
          (sum, s) => sum + (s.price || 0) * (s.qty || 0),
          0
        );

        setFunds({
          openingBalance: THRESHOLD,
          totalInvestment,
          currentValue,
        });
      })
      .catch((e) => console.error(e));
  }, []);

  return <div>Summary Component</div>;
};

export default Summary;
