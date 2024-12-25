import React from 'react';
import { createRoot } from 'react-dom/client';
import NetworkManagementPortal from './NetworkManagementPortal'; // Main Component
import './index.css'; // Tailwind or global CSS

// Get the root element from the HTML file
const container = document.getElementById('root');

// Create the root for React rendering
const root = createRoot(container);

// Render the Network Management Portal within React.StrictMode
root.render(
  <React.StrictMode>
    <NetworkManagementPortal />
  </React.StrictMode>
);
