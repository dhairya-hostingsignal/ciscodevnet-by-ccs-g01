import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Dashboard from "./components/dashboard";

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  // Fetch System Status API
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("https://192.168.1.1/api/v2/status/system", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setSystemStatus(result.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const handleLogout = () => setUser(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Please Login</h2>
          <button
            onClick={() => setUser({ username: "admin" })}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Mock Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 bg-white shadow-md py-4 flex flex-col items-center">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="p-3 mb-2 rounded-lg bg-blue-100 text-blue-600"
          title="Dashboard"
        >
          <LayoutDashboard />
        </button>
        <button
          onClick={handleLogout}
          className="mt-auto p-3 rounded-lg hover:bg-red-100 text-red-600"
          title="Logout"
        >
          <LogOut />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && systemStatus ? (
          <Dashboard systemStatus={systemStatus} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default App;
