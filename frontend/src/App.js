import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import ChatScreenPage from './components/ChatScreenPage/ChatScreenPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatScreenPage />} />
      </Routes>
    </Router>
  );
}

export default App;