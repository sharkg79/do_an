import { useEffect, useState } from "react";
import userApi from "../../api/user.api";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userApi.getProfile().then(res => setUser(res.data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      {/* Update */}
      <form className="bg-white p-4 rounded shadow mb-6">
        <input placeholder="New name" className="input" />
        <button className="btn">Update</button>
      </form>

      {/* Change password */}
      <form className="bg-white p-4 rounded shadow">
        <input type="password" placeholder="Old password" />
        <input type="password" placeholder="New password" />
        <button>Change Password</button>
      </form>
    </div>
  );
}