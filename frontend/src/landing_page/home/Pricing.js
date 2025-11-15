import React from 'react';

function Pricing() {
    return ( 
        <div className="container mb-5 mt-5">
            <div className="row">
                {/* Left section - Heading and description */}
                <div className="col-4">
                    <h1 className="mb-3 fs-2 fw-bold">Unbeatable Pricing</h1>
                    <p>
                        We pioneered the concept of discount broking and price transparency in India. 
                        Enjoy flat fees, zero hidden charges, and industry-best pricing for all your trades.
                    </p>
                    <a 
                        href="/" 
                        className="mx-0 fw-semibold text-decoration-none" 
                        style={{color: "#0d6efd"}}
                    >
                        See detailed pricing <i className="fa-solid fa-arrow-right ms-1"></i>
                    </a>
                </div>

                <div className="col-2"></div>

                {/* Right section - Pricing boxes */}
                <div className="col-6">
                    <div className="row text-center mb-5 align-items-stretch">
                        <div className="col-6 border rounded-3 shadow-sm p-5 h-100">
                            <h1 className="fw-bold">₹0</h1>
                            <p className="mt-3">
                                Free equity delivery and <br />
                                direct mutual funds
                            </p>
                        </div>
                        <div className="col-6 border rounded-3 shadow-sm p-5 h-100">
                            <h1 className="fw-bold mb-3">₹20</h1>
                            <p>
                                Intraday, F&O, <br />
                                commodities & currency trades
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Pricing;
