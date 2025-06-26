import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const ClientId = 'YOUR_GOOGLE_CLIENT_ID';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={ClientId}>
            <BrowserRouter>
                <App /> 
            </BrowserRouter>
        </GoogleOAuthProvider>
    </StrictMode>
);
