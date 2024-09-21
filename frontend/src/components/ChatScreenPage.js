import React, { useEffect } from 'react';
import { handleKhalisSSOResponse } from '../utils/khalisSSO';

const ChatScreenPage = () => {
  useEffect(() => {
    const token = handleKhalisSSOResponse();
    if (token) {
      console.log('User token:', token);
      // Proceed with authenticated actions here, like fetching user data
    } else {
      console.error('No token found. Please log in.');
      // Handle the error or redirect to the login page
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Chat Screen</h1>
      <p>This is the chat screen, accessible after Khalis SSO login.</p>
    </div>
  );
};

export default ChatScreenPage;
