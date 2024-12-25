const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchData("/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const disconnectUser = async (userId) => {
    try {
      await fetchData("/users/disconnect", "POST", { userId });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to disconnect user:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">User</th>
            <th className="p-2">IP Address</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.name}</td>
              <td className="p-2 text-center">{user.ip}</td>
              <td className="p-2 text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => disconnectUser(user.id)}
                >
                  Disconnect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
