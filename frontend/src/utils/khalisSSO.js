import Cookies from 'js-cookie';

// Initiate Khalis SSO login by redirecting to the SSO URL
export const initiateKhalisSSO = () => {
  const khalisSSOUrl = process.env.REACT_APP_KHALIS_SSO_URL;
  const redirectUrl = process.env.REACT_APP_REDIRECT_URL.trim();

  console.log("Khalis SSO URL:", khalisSSOUrl);
  console.log("Redirect URL:", redirectUrl);

  // Redirect to Khalis SSO login page with the redirect URL
  window.location.href = `${khalisSSOUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
};

// Handle the Khalis SSO response by extracting the token
export const handleKhalisSSOResponse = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  if (token) {
    // Store token in cookies securely
    Cookies.set('khalisUserToken', token, {
      expires: 7, // Token expires in 7 days
      secure: true, // Use secure cookies for HTTPS
      sameSite: 'Strict', // Prevent CSRF attacks
    });

    // Replace token in URL with clean version to avoid exposing it
    window.history.replaceState({}, document.title, '/chat');
  }
  return null;
};

// Retrieve the token from cookies
export const getKhalisUserToken = () => {
  return Cookies.get('khalisUserToken');
};
