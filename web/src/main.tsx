import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App'
import './index.css'
import {msalConfig} from "./authConfig";
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from '@azure/msal-react';

const msalInstance = new PublicClientApplication(msalConfig);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App/>
        </MsalProvider>
    </React.StrictMode>,
)
