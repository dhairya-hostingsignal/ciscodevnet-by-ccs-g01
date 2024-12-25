import React, { useState, useEffect } from "react";

const FirewallManagement = () => {
  const [aliases, setAliases] = useState([]);
  const [newAlias, setNewAlias] = useState("");

  const fetchAliases = async () => {
    const response = await fetch("https://192.168.1.1/api/v2/firewall/aliases", {
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    });
    const result = await response.json();
    setAliases(result.data || []);
  };

  const addAlias = async () => {
    await fetch("https://192.168.1.1/api/v2/firewall/alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
      body: JSON.stringify({ name: newAlias, type: "host" }),
    });
    fetchAliases();
    setNewAlias("");
  };

  useEffect(() => {
    fetchAliases();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Firewall Management</h2>
      <input
        type="text"
        value={newAlias}
        onChange={(e) => setNewAlias(e.target.value)}
        placeholder="New Alias Name"
        className="border p-2 mr-2"
      />
      <button onClick={addAlias} className="bg-blue-500 text-white p-2 rounded">
        Add Alias
      </button>
      <ul>
        {aliases.map((alias) => (
          <li key={alias.id}>{alias.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirewallManagement;
