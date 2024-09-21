export const initiateKhalisSSO = () => {
    const khalisSSOUrl = process.env.REACT_APP_KHALIS_SSO_URL;
    const redirectUrl = process.env.REACT_APP_REDIRECT_URL;

    console.log("Khalis SSO URL:", khalisSSOUrl);
    console.log("Redirect URL:", redirectUrl);

    // Redirect user to Khalis SSO login page
    window.location.href = `${khalisSSOUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
};

  
  export const handleKhalisSSOResponse = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      // Store token securely in localStorage
      localStorage.setItem('khalisUserToken', token);
      return token;
    }
    return null;
  };
  