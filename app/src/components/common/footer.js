import React from "react";
import "./footer.css";
import { FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/logo/iitpkdlogosmall.webp" alt="Student Affairs Council Logo" className="footer-logo" />
        <div className="footer-text">
          <h2 className="sac-title">Student Affairs Council</h2>
          <div className="footer-line"></div>
          <p className="iitp-text">Indian Institute of Technology Palakkad</p>
          <p className="copyright">Copyright © 2025. All rights reserved.</p>
        </div>
      </div>

      <div className="footer-right">
        <h3>Address</h3>
        <p>Indian Institute of Technology Palakkad</p>
        <p>Kanjikkode | Palakkad</p>
        <p>Kerala | Pin: 678623</p>
        <div className="social-icons">
          <a href="https://twitter.com/PalakkadIIT" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={18} />
          </a>
          <a href="https://in.linkedin.com/school/iitpkd/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={18} />
          </a>
          <a href="https://www.youtube.com/@IITPalakkad_Official" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;