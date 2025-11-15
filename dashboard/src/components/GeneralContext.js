import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, ownedQty) => {},
  closeSellWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [sellStockUID, setSellStockUID] = useState("");
  const [sellStockQty, setSellStockQty] = useState(0);

  // Buy handlers
  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  // Sell handlers
  const handleOpenSellWindow = (uid, qty) => {
    setIsSellWindowOpen(true);
    setSellStockUID(uid);
    setSellStockQty(qty);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSellStockUID("");
    setSellStockQty(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={sellStockUID} ownedQty={sellStockQty} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
