import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchGurbaniData, getSourceID } from './utils';
import ChatArea from '../ChatArea/ChatArea';
import RightBox from '../RightBox/RightBox';
import logo from '../../assets/images/hazur_image.png';
import './ChatScreenPage.css';

const ChatScreenPage = () => {
  const [query, setQuery] = useState('');
  const [shabadDetails, setShabadDetails] = useState([]);
  const [gurbaniData, setGurbaniData] = useState([]);
  const [selectedSource, setSelectedSource] = useState('Sri Guru Granth Sahib Ji');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sourceCounts, setSourceCounts] = useState({
    'Sri Guru Granth Sahib Ji': 0,
    'Sri Dasam Granth Sahib': 0,
    'Vaaran Bhai Gurdas Ji': 0,
    'Mahan Kosh': 0,
  });

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (query) {
      await fetchGurbaniData(
        query,
        selectedSource,
        setGurbaniData,
        setHistory,
        setSourceCounts,
        setShabadDetails,
        setLoading
      );
    }
  };

  useEffect(() => {
    const token = Cookies.get('khalisUserToken');
    if (!token) {
      console.error('No token found, user is not authenticated');
    }
  }, []);

  return (
    <div className="chat-screen-container">
      <ChatArea
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        loading={loading}
        shabadDetails={shabadDetails || []}
        selectedSource={selectedSource}
        logo={logo}
      />

      <RightBox
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        sourceCounts={sourceCounts}
        history={history}
        query={query}
        fetchGurbaniData={fetchGurbaniData}
        setGurbaniData={setGurbaniData}
        setHistory={setHistory}
        setSourceCounts={setSourceCounts}
        setShabadDetails={setShabadDetails}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatScreenPage;