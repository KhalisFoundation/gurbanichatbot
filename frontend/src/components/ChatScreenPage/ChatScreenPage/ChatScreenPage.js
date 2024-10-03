import React, { useState, useEffect } from 'react';
import { fetchGurbaniData } from './utils'; // Importing from utils/index.js
import ChatArea from '../../ChatArea.js';
import RightBox from '../../RightBox.js';
import logo from '../../../images/hazur_image.png'; 

import './ChatScreenPage.css';


const ChatScreenPage = () => {
  const [query, setQuery] = useState('');
  const [gurbaniData, setGurbaniData] = useState([]);
  const [shabadDetails, setShabadDetails] = useState([]);
  const [selectedSource, setSelectedSource] = useState('Sri Guru Granth Sahib Ji');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sourceCounts, setSourceCounts] = useState({
    'Sri Guru Granth Sahib Ji': 0,
    'Sri Dasam Granth Sahib': 0,
    'Vaaran Bhai Gurdas Ji': 0,
    'Mahan Kosh': 0,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Authentication logic here
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (query) {
      await fetchGurbaniData(query, selectedSource, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading);
    }
  };

  return (
    <div className="chat-screen-container">
      {/* Chat Area */}
      <ChatArea 
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        loading={loading}
        shabadDetails={shabadDetails}
        selectedSource={selectedSource}
        logo={logo}
      />

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            &times; {/* Close icon */}
          </button>
        ) : (
          <span>&#9776;</span> // Hamburger icon
        )}
      </div>

      {/* Right Side Box with Sources and History */}
      {menuOpen && (
        <div className="right-box">
          <RightBox 
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            sourceCounts={sourceCounts}
            history={history}
            logo={logo}
          />
        </div>
      )}
    </div>
  );
};

export default ChatScreenPage;