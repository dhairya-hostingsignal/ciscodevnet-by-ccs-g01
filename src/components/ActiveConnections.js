import React, { useState, useEffect } from "react";

const ActiveConnections = () => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetch("https://192.168.1.1/api/v2/status/interfaces", {
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((res) => res.json())
      .then((data) => setConnections(data.data || []));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Connections</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th>Interface</th>
            <th>IP Address</th>
            <th>MAC Address</th>
            <th>In Bytes</th>
            <th>Out Bytes</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, idx) => (
            <tr key={idx}>
              <td>{conn.descr || "N/A"}</td>
              <td>{conn.ipaddr || "N/A"}</td>
              <td>{conn.macaddr || "N/A"}</td>
              <td>{conn.inbytes || 0}</td>
              <td>{conn.outbytes || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveConnections;
