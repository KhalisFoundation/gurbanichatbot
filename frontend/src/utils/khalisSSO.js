// auth.js

import Cookies from 'js-cookie';

// Initiate Khalis SSO login by redirecting to the SSO URL
export const initiateKhalisSSO = () => {
  const khalisSSOUrl = process.env.REACT_APP_KHALIS_SSO_URL;
  const redirectUrl = process.env.NODE_ENV === 'production' 
  ? 'https://hazur.vercel.app/chat' 
  : 'http://localhost:3000/chat';

window.location.href = `${khalisSSOUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;


  // Redirect to Khalis SSO login page with the redirect URL
  window.location.href = `${khalisSSOUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
};

// Handle the Khalis SSO response by extracting the token
export const handleKhalisSSOResponse = () => {
  const queryParams = new URLSearchParams(window.location.search); // Extract query params
  const token = queryParams.get('token'); // Get the token from the URL

  if (token) {
    // Store token securely in cookies (remove 'secure' flag for local development)
    Cookies.set('khalisUserToken', token, {
      expires: 7, // Token expires in 7 days
      sameSite: 'Strict', // Prevent CSRF attacks
    });

    // Clean the URL by removing the token from the address bar
    window.history.replaceState({}, document.title, '/chat');
    console.log("Token successfully stored in cookies.");
  } else {
    console.log("No token found in URL parameters.");
  }
};
// Retrieve the token from cookies
export const getKhalisUserToken = () => {
  return Cookies.get('khalisUserToken');
};
