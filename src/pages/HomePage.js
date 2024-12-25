import React, { useState } from 'react';
import Sidebar from './Sidebar';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Active Users</h3>
                <p className="text-2xl">42</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Bandwidth Usage</h3>
                <p className="text-2xl">15.6 GB</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg shadow">
                <h3 className="font-bold mb-2">Security Alerts</h3>
                <p className="text-2xl">3</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2">IP Address</th>
                  <th className="p-2">Device Type</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">John Doe</td>
                  <td className="p-2 text-center">192.168.1.105</td>
                  <td className="p-2 text-center">Laptop</td>
                  <td className="p-2 text-center">
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Disconnect
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'wifi':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Wi-Fi Control</h2>
            <p>Manage your Wi-Fi settings here.</p>
          </div>
        );
      case 'security':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Security</h2>
            <p>View security alerts and configure your firewall settings.</p>
          </div>
        );
      case 'network':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Network Config</h2>
            <p>Manage your network configurations.</p>
          </div>
        );
      case 'monitoring':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Monitoring</h2>
            <p>View system and network monitoring details.</p>
          </div>
        );
      case 'reports':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p>Access system reports and logs here.</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p>Modify your system settings here.</p>
          </div>
        );
      default:
        return <div>Select a section to view details.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default HomePage;
