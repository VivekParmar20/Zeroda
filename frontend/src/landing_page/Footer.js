import React from 'react';

function Footer() {
    return ( 
        <footer className="container border-top pt-5 mt-5">
            <div className="row">
                {/* Logo + copyright */}
                <div className="col-md-3 mb-4">
                    <img 
                        src="media/images/logo.svg" 
                        alt="Zerodha Logo" 
                        style={{width:"60%", marginBottom:"1rem"}}
                    />
                    <p className="text-muted small mb-0">
                        &copy; 2010 - 2025, Zerodha Broking Ltd. <br />
                        All rights reserved.
                    </p>
                </div>

                {/* Company links */}
                <div className="col-md-3 mb-4">
                    <h6 className="fw-bold">Company</h6>
                    <ul className="list-unstyled">
                        <li><a href="/" className="text-decoration-none text-muted">Products</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Pricing</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Referral Programme</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Careers</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Zerodha.tech</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Press & Media</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Zerodha Cares (CSR)</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">About</a></li>
                    </ul>
                </div>

                {/* Support links */}
                <div className="col-md-3 mb-4">
                    <h6 className="fw-bold">Support</h6>
                    <ul className="list-unstyled">
                        <li><a href="/" className="text-decoration-none text-muted">Contact</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Support Portal</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Z-Connect Blog</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">List of Charges</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Downloads & Resources</a></li>
                    </ul>
                </div>

                {/* Account links */}
                <div className="col-md-3 mb-4">
                    <h6 className="fw-bold">Account</h6>
                    <ul className="list-unstyled">
                        <li><a href="/" className="text-decoration-none text-muted">Open an Account</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">Fund Transfer</a></li>
                        <li><a href="/" className="text-decoration-none text-muted">60 Day Challenge</a></li>
                    </ul>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-muted small" style={{lineHeight:"1.6"}}>
                <p>
                    Zerodha Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633. 
                    CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019. 
                    Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025; SEBI Registration no.: INZ000038238. 
                    Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, 
                    J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. 
                </p>

                <p>
                    For any complaints pertaining to securities broking please write to <a href="mailto:complaints@zerodha.com">complaints@zerodha.com</a>, 
                    for DP related queries write to <a href="mailto:dp@zerodha.com">dp@zerodha.com</a>. 
                    Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF.
                </p>

                <p>
                    Investments in securities markets are subject to market risks. Please read all the related documents carefully before investing.
                </p>

                <p className="mb-0">
                    Attention Investors: Stock brokers can accept securities as margins from clients only by way of pledge in the depository system 
                    w.e.f September 01, 2020. Update your mobile/email with your stock broker and receive OTP directly from the depository 
                    when pledging securities. Check your securities in the consolidated account statement issued by NSDL/CDSL every month.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
