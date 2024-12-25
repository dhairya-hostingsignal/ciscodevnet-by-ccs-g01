import React, { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  Link,
  Activity,
  Server,
  Cog, 
  Save, 
  RefreshCcw, 
  Database,
  PlusCircle,
  Trash2,
  CheckCircle,
} from "lucide-react";



// Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin({ username });
    } else {
      setError("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Login
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to fetch status data
  const fetchStatus = () => {
    fetch("https://192.168.1.1/api/v2/status/system", {
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Set interval to fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;

  // Data for charts
  const cpuMemoryData = [
    { name: "CPU Usage", value: status.cpu_usage },
    { name: "Memory Usage", value: status.mem_usage },
  ];

  const diskData = [
    { name: "Used", value: status.disk_usage },
    { name: "Free", value: 100 - status.disk_usage },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Uptime Card */}
      <div className="p-4 bg-blue-100 rounded shadow">
        <h2 className="font-bold">System Uptime</h2>
        <p>{status.uptime}</p>
      </div>

      {/* CPU and Memory Usage Chart */}
      <div className="p-4 bg-green-100 rounded shadow">
        <h2 className="font-bold mb-4">CPU & Memory Usage</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={cpuMemoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {cpuMemoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Disk Usage Chart */}
      <div className="p-4 bg-yellow-100 rounded shadow">
        <h2 className="font-bold mb-4">Disk Usage</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={diskData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {diskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Memory Usage Over Time Chart */}
      <div className="p-4 bg-red-100 rounded shadow">
        <h2 className="font-bold mb-4">Memory Usage Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={[
              { name: "1 min ago", value: 20 },
              { name: "Now", value: status.mem_usage },
            ]}
          >
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Users (Leases)
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://192.168.1.1/api/v2/status/dhcp_server/leases", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error fetching users: ${response.statusText}`);

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Remove User (DHCP Lease)
  const removeUser = async (macAddress) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://192.168.1.1/api/v2/status/dhcp_server/leases?mac=${macAddress}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error removing user: ${response.statusText}`);

      // Refresh the user list after deletion
      await fetchUsers();
      alert("User removed successfully.");
    } catch (err) {
      setError(err.message || "Failed to remove user.");
    } finally {
      setLoading(false);
    }
  };

  // Load Users on Component Mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading User Management...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase">Hostname</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase">IP</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase">MAC</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-6 py-4 text-gray-700">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-6 py-4">{user.hostname || "N/A"}</td>
                  <td className="px-6 py-4">{user.ip}</td>
                  <td className="px-6 py-4">{user.mac}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeUser(user.mac)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Firewall Management Component
const FirewallManagement = () => {
  const [aliases, setAliases] = useState([]);
  const [newWebsite, setNewWebsite] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch firewall rules from the API
  const fetchFirewallRules = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://192.168.1.1/api/v2/firewall/rules", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error fetching firewall rules: ${response.status}`);

      const result = await response.json();
      setRules(result.data);
    } catch (err) {
      setError(err.message || "Failed to fetch firewall rules.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new firewall rule to block a website
  const blockWebsite = async (website) => {
    if (!website.trim()) return alert("Website URL cannot be empty.");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://192.168.1.1/api/v2/firewall/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
        body: JSON.stringify({
          name: `Block ${website}`,
          source: "any",
          destination: website,
          action: "block",
        }),
      });

      if (!response.ok) throw new Error(`Error adding firewall rule: ${response.status}`);

      await fetchFirewallRules(); // Refresh the rules list
      setNewWebsite(""); // Clear the input field
      alert("Website blocked successfully.");
    } catch (err) {
      setError(err.message || "Failed to block the website.");
    } finally {
      setLoading(false);
    }
  };

  // Apply firewall changes
  const applyChanges = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://192.168.1.1/api/v2/firewall/apply", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error applying changes: ${response.status}`);

      const result = await response.json();
      if (result.data.applied) {
        alert("Firewall changes applied successfully.");
      } else {
        alert("There are no changes to apply.");
      }
    } catch (err) {
      setError(err.message || "Failed to apply changes.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch firewall rules on component mount
  useEffect(() => {
    fetchFirewallRules();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Firewall Management</h2>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Block Website */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Block a Website</h3>
        <input
          type="text"
          placeholder="Enter website URL (e.g., example.com)"
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
          className="px-3 py-2 border rounded-md mr-2"
        />
        <button
          onClick={() => blockWebsite(newWebsite)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Block Website
        </button>
      </div>

      {/* Existing Firewall Rules */}
      <h3 className="font-bold mb-4">Firewall Rules</h3>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Name</th>
            <th className="p-4">Source</th>
            <th className="p-4">Destination</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, idx) => (
            <tr key={idx}>
              <td className="p-4">{rule.name}</td>
              <td className="p-4">{rule.source}</td>
              <td className="p-4">{rule.destination}</td>
              <td className="p-4">{rule.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Apply Changes Button */}
      <div className="mt-6">
        <button
          onClick={applyChanges}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};





// Active Connections Component
const ActiveConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      const response = await fetch("https://192.168.1.1/api/v2/status/interfaces", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      setConnections(result.data);
    } catch (err) {
      setError("Failed to fetch active connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return <p>Loading Active Connections...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Connections</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Interface</th>
            <th className="p-4">IP Address</th>
            <th className="p-4">MAC Address</th>
            <th className="p-4">Status</th>
            <th className="p-4">In Bytes</th>
            <th className="p-4">Out Bytes</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{conn.descr || "N/A"}</td>
              <td className="p-4">{conn.ipaddr || "N/A"}</td>
              <td className="p-4">{conn.macaddr || "N/A"}</td>
              <td className="p-4">{conn.status || "N/A"}</td>
              <td className="p-4">{conn.inbytes || 0}</td>
              <td className="p-4">{conn.outbytes || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



// Settings Component
const Settings = () => {
  const [settings, setSettings] = useState({
    hostname: "",
    dnsServers: [],
    autoBackup: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch current settings from the API
  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://192.168.1.1/api/v2/system/hostname", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch settings: ${response.statusText}`);

      const data = await response.json();
      setSettings({
        hostname: data.data.hostname || "",
        dnsServers: data.data.dnsServers || [],
        autoBackup: data.data.autoBackup || false,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch settings.");
    } finally {
      setLoading(false);
    }
  };

  // Update settings via API
  const updateSettings = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://192.168.1.1/api/v2/system/dns", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error(`Failed to update settings: ${response.statusText}`);

      setSuccessMessage("Settings updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  // Shutdown system via API
const shutdownSystem = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await fetch("https://192.168.1.1/api/v2/diagnostics/halt_system", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    });

    if (!response.ok) throw new Error(`Failed to shut down system: ${response.statusText}`);

    alert("System shutdown initiated successfully.");
  } catch (err) {
    setError(err.message || "Failed to shut down system.");
  } finally {
    setLoading(false);
  }
};


  // Restart system via API
  const restartSystem = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://192.168.1.1/api/v2/diagnostics/reboot", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Failed to restart system: ${response.statusText}`);

      alert("System restart initiated successfully.");
    } catch (err) {
      setError(err.message || "Failed to restart system.");
    } finally {
      setLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return <p>Loading Settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Hostname</label>
        <input
          type="text"
          value={settings.hostname}
          onChange={(e) => setSettings({ ...settings, hostname: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      

      <div className="mb-4">
        <label className="block mb-2 font-medium">DNS Servers</label>
        <input
          type="text"
          value={settings.dnsServers.join(", ")}
          onChange={(e) =>
            setSettings({ ...settings, dnsServers: e.target.value.split(",").map((s) => s.trim()) })
          }
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter comma-separated DNS servers"
        />
      </div>

      

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
            className="mr-2"
          />
          Enable Auto Backup
        </label>
      </div>
      
       

      <div className="flex items-center space-x-4">
        <button
          onClick={updateSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <Save className="mr-2" />
          Save Changes
        </button>
        <button
          onClick={restartSystem}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
        >
          <RefreshCcw className="mr-2" />
          Restart System
        </button>
        <button
    onClick={shutdownSystem}
    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
  >
    <Database className="mr-2" />
    Shutdown System
  </button>
      </div>
    </div>
      
    
  );
};


// NetworkTrafficViewer Component
const NetworkTrafficViewer = () => {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNetworkTraffic = async () => {
    try {
      const response = await fetch("https://192.168.1.1/api/v2/status/interfaces", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      setInterfaces(result.data || []);
    } catch (err) {
      setError("Failed to fetch network traffic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkTraffic();
  }, []);

  if (loading) return <p>Loading Network Traffic...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Network Traffic Viewer</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Interface</th>
            <th className="p-4">IP Address</th>
            <th className="p-4">Status</th>
            <th className="p-4">In Bytes</th>
            <th className="p-4">Out Bytes</th>
            <th className="p-4">In Packets</th>
            <th className="p-4">Out Packets</th>
          </tr>
        </thead>
        <tbody>
          {interfaces.map((iface, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-4">{iface.descr || "N/A"}</td>
              <td className="p-4">{iface.ipaddr || "N/A"}</td>
              <td className="p-4">{iface.status || "N/A"}</td>
              <td className="p-4">{iface.inbytes || 0}</td>
              <td className="p-4">{iface.outbytes || 0}</td>
              <td className="p-4">{iface.inpkts || 0}</td>
              <td className="p-4">{iface.outpkts || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ARPTableManagement = () => {
  const [arpTable, setArpTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchARPTable = async () => {
    try {
      const response = await fetch("https://192.168.1.1/api/v2/diagnostics/arp_table", {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setArpTable(result.data || []); // Use empty array if no data
    } catch (err) {
      setError(err.message || "Failed to fetch ARP Table data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchARPTable();
  }, []);

  if (loading) return <p>Loading ARP Table...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">ARP Table Management</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">IP Address</th>
            <th className="p-4">MAC Address</th>
            <th className="p-4">Interface</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {arpTable.map((entry, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-4">{entry.ipaddr || "N/A"}</td>
              <td className="p-4">{entry.macaddr || "N/A"}</td>
              <td className="p-4">{entry.interface || "N/A"}</td>
              <td className="p-4">{entry.status || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};



// Main Component
const NetworkManagementPortal = () => {
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="flex h-screen">
      <div className="w-20 bg-white flex flex-col items-center shadow-md">
        {[
          ["dashboard", LayoutDashboard],
          ["users", Users],
          ["firewall", Shield],
          ["active_connections", Link],
          ["network_traffic", Activity],
          ["arp_table", Server],
          ["settings", Cog],
        ].map(([tab, Icon]) => (
          <button
            key={tab}
            className={`p-4 ${activeTab === tab ? "bg-blue-100 text-blue-600" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <Icon />
          </button>
        ))}
        <button onClick={() => setUser(null)} className="mt-auto p-4 text-red-600">
          <LogOut />
        </button>
      </div>
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "firewall" && <FirewallManagement />}
        {activeTab === "active_connections" && <ActiveConnections />} 
        {activeTab === "network_traffic" && <NetworkTrafficViewer />}
        {activeTab === "arp_table" && <ARPTableManagement />}
        {activeTab === "settings" && <Settings />}

      </div>
    </div>
  );
};

export default NetworkManagementPortal;
