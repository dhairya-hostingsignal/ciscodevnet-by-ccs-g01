import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://192.168.1.1/api/v2/status/dhcp_server/leases", {
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Hostname</th>
            <th className="p-4">IP</th>
            <th className="p-4">MAC</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td className="p-4">{user.hostname || "N/A"}</td>
              <td className="p-4">{user.ip}</td>
              <td className="p-4">{user.mac}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
