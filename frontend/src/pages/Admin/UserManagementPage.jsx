import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/users";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE ROLE =================
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.put(
        `${API}/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#f7f9fa] p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        User Management
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg border border-gray-200 shadow-lg p-5 
                         transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              {/* USER INFO */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              {/* ROLE */}
              <div className="mb-4">
                <label className="text-sm text-gray-600">Role</label>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user._id, e.target.value)
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2 
                             focus:outline-none focus:ring-2 
                             focus:ring-[#A435F0]"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </div>

              {/* ACTION */}
              <button
                onClick={() => handleDelete(user._id)}
                className="w-full bg-[#A435F0] text-white py-2 rounded-md 
                           font-medium transition 
                           hover:bg-[#8710d8]"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;