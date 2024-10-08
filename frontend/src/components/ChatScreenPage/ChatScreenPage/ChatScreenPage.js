import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import { fetchGurbaniData, getSourceID } from './utils'; 
import ChatArea from '../../ChatArea';
import RightBox from '../../RightBox';
import logo from '../../../images/hazur_image.png';
import './ChatScreenPage.css';

const ChatScreenPage = () => {
  const [query, setQuery] = useState(''); 
  const [shabadDetails, setShabadDetails] = useState([]); 
  const [gurbaniData, setGurbaniData] = useState([]); // Define gurbaniData state here
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
    const token = Cookies.get('khalisUserToken');
    
    if (token) {
      console.log('User token:', token);
      // Use token if needed for authenticated requests
    } else {
      console.error('No token found, user is not authenticated');
      // Optionally, handle unauthenticated users, like redirect to login
    }
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (query) {
      await fetchGurbaniData(
        query, 
        selectedSource, 
        setGurbaniData, // Correctly passing setGurbaniData now
        setHistory, 
        setSourceCounts, 
        setShabadDetails, 
        setLoading
      );
    }
  };

  const filteredShabadDetails = shabadDetails.filter(item => item.source === getSourceID(selectedSource));

  return (
    <div className="chat-screen-container">
      <ChatArea
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        loading={loading}
        shabadDetails={filteredShabadDetails}  
        selectedSource={selectedSource}
        logo={logo}
      />

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <button className="close-button" onClick={() => setMenuOpen(false)}>
            &times;
          </button>
        ) : (
          <span>&#9776;</span> 
        )}
      </div>

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
