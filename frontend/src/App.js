import React, { useState, useEffect } from 'react';
import './App.css';

const SP_API = 'https://serviceprovider.khalis.net';

function App() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);

  // Step 1: Initiate login by redirecting to Khalis SSO
  const initiateLogin = () => {
    const redirectUrl = encodeURIComponent('http://localhost:3000'); // or your app's URL
    window.location.href = `${SP_API}/login/sso?redirect_url=${redirectUrl}`;
  };

  // Step 2: Handle redirect and get the token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('userToken', token);
      setUserToken(token);
      fetchUserDetails(token); // Fetch user info when logged in
    } else {
      const savedToken = localStorage.getItem('userToken');
      if (savedToken) {
        setUserToken(savedToken);
        fetchUserDetails(savedToken);
      }
    }
  }, []);

  // Step 3: Fetch user details
  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${SP_API}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle input changes for the query
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query || !userToken) return;

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

  // Fetch Gurbani data based on query
  const fetchGurbaniData = async (query) => {
    const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
    const data = await response.json();
    return data.results;
  };

  // Fetch shabad details based on Shabad ID
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

  // Toggle profile visibility
  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="user-header">
          {userData ? (
            <div className="user-info">
              <img
                className="user-avatar"
                src="https://www.w3schools.com/w3images/avatar2.png"
                alt="User Avatar"
                onClick={toggleProfile}
                style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }}
              />
              {profileVisible && (
                <div className="user-dropdown" style={{ position: 'absolute', top: '50px', right: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                  <p><strong>Name:</strong> {userData.firstname} {userData.lastname}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <button onClick={() => setProfileVisible(false)}>Close</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={initiateLogin} 
              className="login-button" 
              style={{ position: 'absolute', top: '20px', right: '20px' }}
            >
              Login with Khalis Account
            </button>
          )}
        </div>
      </header>

      <main className="chat-container">
        {responses.map((res, index) => (
          <div key={index} className="chat-message">
            <div className="user-query">
              <div className="user-icon">
                <img src="https://www.w3schools.com/w3images/avatar2.png" alt="User Icon" />
              </div>
              <div className="message-bubble user-bubble">
                <p>{res.query}</p>
              </div>
            </div>

            <div className="bot-response">
              <div className="bot-icon">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="Bot Icon" />
              </div>
              <div className="message-bubble bot-bubble">
                {Array.isArray(res.result) ? res.result.map((shabad, i) => (
                  <div key={i}>
                    <h3>Shabad ID: {shabad.shabadId}</h3>
                    {shabad.verses.map((verse, idx) => (
                      <p key={idx}><strong>{verse.verse}</strong>: {verse.translation}</p>
                    ))}
                  </div>
                )) : (
                  <p>{res.result}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {userToken && (
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
        )}
      </main>
    </div>
  );
}

export default App;
