import React from 'react';
import './RightBox.css';
import logo from '../../assets/images/hazur_image.png';
import image1 from '../../assets/images/sourcelogo1.png';
import image22 from '../../assets/images/sourcelogo2.png';
import image3 from '../../assets/images/sourcelogo3.png';
import image4 from '../../assets/images/sourcelogo4.png';

const logoImages = [image1, image22, image3, image4];

const RightBox = ({
  selectedSource,
  setSelectedSource,
  sourceCounts = {},
  history = [],
  logoSize = 30,
  fetchGurbaniData,
  query,
  setGurbaniData,
  setHistory,
  setSourceCounts,
  setShabadDetails,
  setLoading,
}) => {
  const handleSourceClick = (source) => {
    setSelectedSource(source);

    if (sourceCounts[source] > 0 && query) {
      fetchGurbaniData(query, source, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading);
    }
  };

  return (
    <div className="right-box">
      <div className="source-section">
        <h3 className="orange-text">SOURCES</h3>
        <ul>
          {['Sri Guru Granth Sahib Ji', 'Sri Dasam Granth Sahib', 'Vaaran Bhai Gurdas Ji', 'Mahan Kosh'].map((source, index) => (
            <li
              key={source}
              className={`source-item ${selectedSource === source ? 'active' : ''}`}
              onClick={() => handleSourceClick(source)}
            >
              <img src={logoImages[index]} alt={source} style={{ width: logoSize, height: logoSize }} />
              <span className="source-text">{source}</span>
              <span className={`count ${sourceCounts[source] === 0 ? 'zero' : 'non-zero'}`}>
                {sourceCounts[source] || 0}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr />

      <div className="history-section">
        <h3 className="orange-text">HISTORY</h3>
        <ul>
          {history.length > 0 ? history.map((query, index) => (
            <li key={index} className="history-item">{query}</li>
          )) : <li>No search history available.</li>}
        </ul>
      </div>

      <div className="logo-section">
        <img src={logo} alt="Logo" className="hazur-image" />
        <span className="hazur-text">H A Z U R</span>
      </div>
    </div>
  );
};

export default RightBox;
