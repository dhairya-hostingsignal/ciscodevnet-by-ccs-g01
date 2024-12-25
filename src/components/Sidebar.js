import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Adjust path based on your file structure

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div>Dashboard Content</div>;
      case 'users':
        return <div>User Management Content</div>;
      case 'wifi':
        return <div>Wi-Fi Control Content</div>;
      // Add other cases as needed
      default:
        return <div>Select a section to view details</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default App;
