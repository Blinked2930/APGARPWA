import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css'
import App from './App.jsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  createRoot(document.getElementById('root')).render(
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#e11d48' }}>PWA Configuration Error</h1>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>VITE_CONVEX_URL is missing.</p>
      <p style={{ color: '#64748b' }}>If you are seeing this on Vercel, it means the Environment Variable was not injected during the build. Please go to Vercel - Settings - Environment Variables, add <b>VITE_CONVEX_URL</b> with your Convex backend URL, and click <b>Redeploy</b>.</p>
    </div>
  );
} else {
  const convex = new ConvexReactClient(convexUrl);
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </StrictMode>,
  );
}
