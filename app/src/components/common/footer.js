import React from "react";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/logo192.png" alt="Student Affairs Council Logo" className="footer-logo" />
        <div className="footer-text">
          <h2 className="sac-title">Student Affairs Council</h2>
          <div className="footer-line"></div>
          <p className="iitp-text">Indian Institute of Technology Palakkad</p>
          <p className="copyright">Copyright © 2023. All rights reserved.</p>
        </div>
      </div>

      <div className="footer-right">
        <h3>Address</h3>
        <p>Indian Institute of Technology Palakkad</p>
        <p>Kanjikkode | Palakkad</p>
        <p>Kerala | Pin: 678623</p>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
