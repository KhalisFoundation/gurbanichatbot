import React from 'react';
import './RightBox.css';
import logo from '../assets/images/hazur_image.png'; // Ensure this path is correct

// Importing the source images properly
import image1 from '../assets/images/image1.png';
import image22 from '../assets/images/image22.png'; // Ensure correct file name
import image3 from '../assets/images/image3.png';
import image4 from '../assets/images/image4.png';

// Array of the image sources
const logoImages = [image1, image22, image3, image4];

const RightBox = ({ selectedSource, setSelectedSource, sourceCounts, history, logoSize = 30 }) => {
  return (
    <div className="right-box">
      {/* Top Half: Sources */}
      <div className="source-section">
        <h3 className="orange-text">SOURCES</h3>
        <ul>
          {['Sri Guru Granth Sahib Ji', 'Sri Dasam Granth Sahib', 'Vaaran Bhai Gurdas Ji', 'Mahan Kosh'].map((source, index) => (
            <li
              key={source}
              className={`source-item ${selectedSource === source ? 'active' : ''}`}
              onClick={() => setSelectedSource(source)}
            >
              <img src={logoImages[index]} alt={source} style={{ width: logoSize, height: logoSize }} />
              <span className="source-text">{source}</span>
              <span className={`count ${sourceCounts[source] === 0 ? 'zero' : 'non-zero'}`}>
                {sourceCounts[source]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Separator */}
      <hr />

      {/* Bottom Half: History */}
      <div className="history-section">
        <h3 className="orange-text">HISTORY</h3>
        <ul>
          {history.map((query, index) => (
            <li key={index} className="history-item">{query}</li>
          ))}
        </ul>
      </div>

      {/* Logo and Hazur text at the bottom */}
      <div className="logo-section">
        <img src={logo} alt="Logo" className="hazur-image" />
        <span className="hazur-text">H A Z U R</span>
      </div>
    </div>
  );
};

export default RightBox;