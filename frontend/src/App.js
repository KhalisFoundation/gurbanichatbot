import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
      const gurbaniData = await fetchGurbaniData(query);
      const shabadDetails = await fetchShabadDetails(gurbaniData);
      setResponses((prev) => [...prev, { query, result: shabadDetails }]);
    } catch (error) {
      setResponses((prev) => [...prev, { query, result: 'Error fetching data' }]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGurbaniData = async (query) => {
    const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
    const data = await response.json();
    return data.results;
  };

  const fetchShabadDetails = async (gurbaniData) => {
    let shabadDetails = [];
    for (let item of gurbaniData) {
      const shabadId = item.Payload.ShabadID;
      const response = await fetch(`https://api.banidb.com/v2/shabads/${shabadId}`);
      const data = await response.json();
      
      // Collecting verses with translations (limiting to 5 verses for now)
      const verses = data.verses.slice(0, 5).map(verse => ({
        verse: verse.verse.unicode,
        translation: verse.translation?.en?.bdb || 'Translation not available'
      }));

      shabadDetails.push({ shabadId, verses });
    }
    return shabadDetails;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gurbani Chat Interface</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit} className="query-form">
          <input 
            type="text" 
            value={query}
            onChange={handleInputChange} 
            placeholder="Ask about Gurbani..." 
            className="query-input"
          />
          <button type="submit" disabled={loading} className={`submit-button ${loading ? 'loading' : ''}`}>
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>

        <div className="chat-box">
          {responses.map((res, index) => (
            <div key={index} className="response">
              <p className="query-text"><strong>Query:</strong> {res.query}</p>
              <div className="result">
                {Array.isArray(res.result) ? res.result.map((shabad, i) => (
                  <div key={i} className="shabad-block">
                    <h3 className="shabad-id">Shabad ID: {shabad.shabadId}</h3>
                    {shabad.verses.map((verse, idx) => (
                      <div key={idx} className="verse-block">
                        <p><strong>Verse:</strong> {verse.verse}</p>
                        <p><strong>Translation:</strong> {verse.translation}</p>
                      </div>
                    ))}
                  </div>
                )) : (
                  <p>{res.result}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
