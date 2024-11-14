import React, { useState } from 'react';
import '../ChatScreenPage/ChatScreenPage.css';
import expandicon from '../../assets/images/Frame.png';
import image from '../../assets/images/response.png';
import blueCircleImage from '../../assets/images/youlogo.png';
import './ChatArea.css';
import ExpandedShabad from './ExpandedShabad';

const ChatArea = ({ query, setQuery, handleQuerySubmit, loading, shabadDetails = [], selectedSource }) => {
  const suggestions = [
    "When to pray?",
    "Who created Vedas?",
    "What is the meaning of life?",
    "How to attain salvation?",
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(e.target.value.trim() !== '');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmittedQuery(query);
      handleQuerySubmit(e);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`chat-area ${isExpanded ? 'expanded' : ''}`}>
      {!isExpanded && submittedQuery && (
        <div className="question-display-top">
          <span className="question-top-text">{submittedQuery}</span>
        </div>
      )}

      {!isExpanded && <hr className="question-separator" />}

      {!isExpanded && submittedQuery && (
        <div className="question-source-section">
          <div className="question-display">
            <div className="circle blue-circle">
              <img src={blueCircleImage} alt="Blue Circle" className="logo-small" />
            </div>
            <span className="sender-label">You</span>
          </div>
          <div className="question-text-wrapper">
            <span className="question-text">{submittedQuery}</span>
          </div>
        </div>
      )}

      {!isExpanded && submittedQuery && selectedSource && (
        <div className="source-display">
          <div className="circle orange-circle">
            <img src={image} alt="Source Icon" className="source-image" />
          </div>
          <span className="source-text">{selectedSource}</span>
        </div>
      )}

      <div className="results-section">
        {loading && <p>Loading...</p>}
        {!loading && (!Array.isArray(shabadDetails) || shabadDetails.length === 0) && (
          <p>No results found. Try another query.</p>
        )}
        {!loading && Array.isArray(shabadDetails) && shabadDetails.length > 0 && (
          <>
            {!isExpanded ? (
              <div className="result-card top-result">
                <h3 className="gurbani-title orange-text">TOP RESULT</h3>
                <div className="expand-icon-container" onClick={toggleExpand}>
                  <img src={expandicon} alt="Expand" className="expand-icon-img" />
                </div>
                {shabadDetails[0].verses ? (
                  shabadDetails[0].verses.map((verse, index) => (
                    <div key={index}>
                      <p className="gurbani-verse">{verse.verse}</p>
                      <p className="gurbani-translation">{verse.translation}</p>
                    </div>
                  ))
                ) : (
                  <p>No verses available for this shabad.</p>
                )}
              </div>
            ) : (
              <ExpandedShabad shabad={shabadDetails[0]} onClose={toggleExpand} />
            )}

            {!isExpanded &&
              shabadDetails.slice(1).map((shabad, shabadIndex) => (
                <div key={shabad.shabadId || shabadIndex} className="result-card">
                  <h3 className="gurbani-title orange-text">OTHER RESULTS</h3>
                  {shabad.verses ? (
                    shabad.verses.map((verse, verseIndex) => (
                      <div key={verseIndex}>
                        <p className="gurbani-verse">{verse.verse}</p>
                        <p className="gurbani-translation">{verse.translation}</p>
                      </div>
                    ))
                  ) : (
                    <p>No verses available for this shabad.</p>
                  )}
                </div>
              ))}
          </>
        )}
      </div>

      {!isExpanded && showSuggestions && (
        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-box" onClick={() => setQuery(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {!isExpanded && (
        <form className="query-form" onSubmit={handleFormSubmit}>
          <p className="query-instruction">Type your question above</p>
          <input
            className="query-input"
            type="text"
            placeholder="Enter your query..."
            value={query}
            onChange={handleInputChange}
          />
          <button className="query-submit-btn" type="submit">
            <span className="arrow">&#x2794;</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatArea;
