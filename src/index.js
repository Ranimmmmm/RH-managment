import React from 'react';
import ReactDOM from 'react-dom/client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

ReactDOM.createRoot(  document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='629597666189-mcunqel6akij5nm6ci57madbqspnl4nt.apps.googleusercontent.com'
  onScriptLoadError={() => console.error('Google OAuth script failed to load')}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    
  </GoogleOAuthProvider>

)

  
