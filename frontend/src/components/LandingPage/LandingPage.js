import React from 'react';
import './LandingPage.css'; // CSS for styling
import logo from '../../assets/images/hazur_image.png';
import homepage from '../../assets/images/homepage.png'; // Ensure this path is correct
import khalisLogo from '../../assets/images/logo_image.png'; // Import Khalis logo
import { initiateKhalisSSO } from '../../utils/khalisSSO'; // Import the SSO initiation function

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="logo">
        <img src={logo} alt="Hazur Logo" />
      </div>
      <h1 className="landing-text">Hazur</h1>

      {/* Main Content Card */}
      <div className="main-card">
        <img src={homepage} alt="Homepage" className="homepagecard" />
      </div>

      {/* Khalis Login Button */}
      <button className="khalis-button" onClick={initiateKhalisSSO}>
        <div className="khalis-icon">
          <img src={khalisLogo} alt="Khalis Logo" />
        </div>
        Sign in with Khalis
      </button>
    </div>
  );
};

export default LandingPage;
