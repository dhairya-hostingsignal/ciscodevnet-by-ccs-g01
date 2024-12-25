import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://192.168.1.1/api/v2/status/system", {
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-blue-100 rounded shadow">
        <h2>System Uptime</h2>
        <p>{status.uptime}</p>
      </div>
      <div className="p-4 bg-green-100 rounded shadow">
        <h2>CPU Usage</h2>
        <p>{status.cpu_usage}%</p>
      </div>
      <div className="p-4 bg-yellow-100 rounded shadow">
        <h2>Memory Usage</h2>
        <p>{status.mem_usage}%</p>
      </div>
      <div className="p-4 bg-red-100 rounded shadow">
        <h2>Disk Usage</h2>
        <p>{status.disk_usage}%</p>
      </div>
    </div>
  );
};

export default Dashboard;
