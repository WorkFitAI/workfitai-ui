import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-50">
      <div className="container">
        <div className="footer-bottom mt-50">
          <div className="row">
            <div className="col-md-6">
              <span className="font-xs color-text-paragraph">
                Copyright © 2025. WorkfitAI all right reserved
              </span>
            </div>
            <div className="col-md-6 text-md-end text-start">
              <div className="footer-social">
                <a className="font-xs color-text-paragraph" href="#">
                  Privacy Policy
                </a>
                <a
                  className="font-xs color-text-paragraph mr-30 ml-30"
                  href="#"
                >
                  Terms &amp; Conditions
                </a>
                <a className="font-xs color-text-paragraph" href="#">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
