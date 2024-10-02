
import React, { useState, useEffect } from 'react';
import { handleKhalisSSOResponse } from '../utils/khalisSSO';
import ChatArea from '../components/ChatArea';
import RightBox from '../components/RightBox';
import logo from '../images/hazur_image.png'; // Ensure the correct path to your logo
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
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu

  useEffect(() => {
    const token = handleKhalisSSOResponse();
    if (token) {
      console.log('User token:', token);
    } else {
      console.error('No token found. Please log in.');
    }
  }, []);

  const fetchGurbaniData = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
      const data = await response.json();
      console.log('API Response Data:', data);

      const filteredData = data.results.filter(item => item.Payload.SourceID === getSourceID(selectedSource));
      setGurbaniData(filteredData);
      setHistory(prevHistory => [...prevHistory, query]);

      updateSourceCounts(data.results);

      const shabadData = await fetchShabadDetails(filteredData);
      setShabadDetails(shabadData);
    } catch (error) {
      console.error('Error fetching Gurbani data:', error);
      // Consider setting an error state and displaying an error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Function to update the source counts
  const updateSourceCounts = (data) => {
    const counts = {
      'Sri Guru Granth Sahib Ji': 0,
      'Sri Dasam Granth Sahib': 0,
      'Vaaran Bhai Gurdas Ji': 0,
      'Mahan Kosh': 0,
    };

    data.forEach(item => {
      switch (item.Payload.SourceID) {
        case 'G':
          counts['Sri Guru Granth Sahib Ji'] += 1;
          break;
        case 'D':
          counts['Sri Dasam Granth Sahib'] += 1;
          break;
        case 'V':
          counts['Vaaran Bhai Gurdas Ji'] += 1;
          break;
        case 'M':
          counts['Mahan Kosh'] += 1;
          break;
        default:
          break;
      }
    });

    setSourceCounts(counts);
  };

  // Function to convert the selected source to its corresponding ID
  const getSourceID = (source) => {
    switch (source) {
      case 'Sri Guru Granth Sahib Ji':
        return 'G';
      case 'Sri Dasam Granth Sahib':
        return 'D';
      case 'Vaaran Bhai Gurdas Ji':
        return 'V';
      case 'Mahan Kosh':
        return 'M';
      default:
        return 'G';
    }
  };

  const fetchShabadDetails = async (gurbaniData) => {
    const shabadDetails = [];
    for (const item of gurbaniData) {
      const shabadId = item.Payload.ShabadID;
      try {
        const response = await fetch(`https://api.banidb.com/v2/shabads/${shabadId}`);
        const data = await response.json();
        
        const verses = data.verses.slice(0, 5).map(verse => ({
          verse: verse.verse.unicode,
          translation: verse.translation?.en?.bdb || 'Translation not available',
        }));

        shabadDetails.push({
          shabadId,
          source: item.Payload.SourceID,
          verses,
        });
      } catch (error) {
        console.error(`Error fetching details for Shabad ID ${shabadId}:`, error);
      }
    }
    return shabadDetails;
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (query) {
      await fetchGurbaniData(query);
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
