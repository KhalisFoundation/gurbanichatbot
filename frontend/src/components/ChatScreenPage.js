import React, { useState, useEffect } from 'react';
import { handleKhalisSSOResponse } from '../utils/khalisSSO';
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
    'Mahan Kosh': 0
  });

  useEffect(() => {
    const token = handleKhalisSSOResponse();
    if (token) {
      console.log('User token:', token);
    } else {
      console.error('No token found. Please log in.');
    }
  }, []);

  // Fetch Gurbani data based on the query
  const fetchGurbaniData = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
      const data = await response.json();
      console.log('API Response Data:', data);

      const filteredData = data.results.filter(item => item.Payload.SourceID === getSourceID(selectedSource));
      setGurbaniData(filteredData);
      setHistory([...history, query]);

      updateSourceCounts(data.results);

      const shabadData = await fetchShabadDetails(filteredData);
      setShabadDetails(shabadData);
    } catch (error) {
      console.error('Error fetching Gurbani data:', error);
    }
    setLoading(false);
  };

  // Update the counts for each source
  const updateSourceCounts = (data) => {
    const counts = {
      'Sri Guru Granth Sahib Ji': 0,
      'Sri Dasam Granth Sahib': 0,
      'Vaaran Bhai Gurdas Ji': 0,
      'Mahan Kosh': 0
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

  // Fetch shabad details from Bani DB
  const fetchShabadDetails = async (gurbaniData) => {
    let shabadDetails = [];
    for (let item of gurbaniData) {
      const shabadId = item.Payload.ShabadID;

      try {
        const response = await fetch(`https://api.banidb.com/v2/shabads/${shabadId}`);
        const data = await response.json();

        const verses = data.verses.slice(0, 5).map((verse) => ({
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
      {/* Sidebar for Sources */}
      <div className="sidebar">
        <h3>Sources</h3>
        <ul>
          {['Sri Guru Granth Sahib Ji', 'Sri Dasam Granth Sahib', 'Vaaran Bhai Gurdas Ji', 'Mahan Kosh'].map((source) => (
            <li
              key={source}
              className={selectedSource === source ? 'active' : ''}
              onClick={() => setSelectedSource(source)}
            >
              {source} ({sourceCounts[source]})
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <h2>What would you like to know?</h2>
        </div>

        <form className="query-form" onSubmit={handleQuerySubmit}>
          <input
            type="text"
            placeholder="Type your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="query-input"
          />
          <button type="submit" className="query-submit-btn">Ask</button>
        </form>

        {/* Display Results */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="results-section">
            {shabadDetails.length > 0 && (
              <div className="top-result">
                <h3>Top Result</h3>
                <div className="result-card">
                  <h3>Shabad ID: {shabadDetails[0].shabadId}</h3>
                  {shabadDetails[0].verses.map((verse, index) => (
                    <div key={index}>
                      <p className="gurbani-verse">{verse.verse}</p>
                      <p className="gurbani-translation">{verse.translation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {shabadDetails.length > 1 && (
              <div className="other-results">
                <h3>Other Results</h3>
                {shabadDetails.slice(1).map((item, index) => (
                  <div key={index} className="result-card">
                    <h3>Shabad ID: {item.shabadId}</h3>
                    {item.verses.map((verse, vIndex) => (
                      <div key={vIndex}>
                        <p className="gurbani-verse">{verse.verse}</p>
                        <p className="gurbani-translation">{verse.translation}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="history-panel">
        <h3>History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatScreenPage;
