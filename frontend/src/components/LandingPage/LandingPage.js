import React from 'react';
import './LandingPage.css'; // CSS for styling
import logo from '../../assets/images/hazur_image.png'; // Ensure this path is correct // Your logo image
import khalisLogo from '../../assets/images/logo_image.png'; // Ensure this path is correct // Import Khalis logo
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
        <h2>Main Content Card</h2>
        <p>
          This is where the main content will go. You can add more details or elements here.
        </p>
      </div>

      {/* Khalis Login Button */}
      <button className="khalis-button" onClick={initiateKhalisSSO}>
        <img src={khalisLogo} alt="Khalis Logo" className="khalis-icon" />
        Sign in with Khalis
      </button>
    </div>
  );
};

export default LandingPage;