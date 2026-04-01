import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/reports/dashboard";

const SystemOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#f7f9fa] p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        System Overview
      </h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* ===== STATS CARDS ===== */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card title="Total Users" value={data.totalUsers} />
            <Card title="Total Courses" value={data.totalCourses} />
            <Card title="Total Classes" value={data.totalClasses} />
            <Card title="Revenue" value={`$${data.totalRevenue || 0}`} />
          </div>

          {/* ===== EXTRA SECTION ===== */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              System Insights
            </h2>

            <p className="text-gray-600">
              This dashboard provides a quick overview of your e-learning platform.
              You can monitor users, courses, and overall performance here.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ================= CARD COMPONENT =================
const Card = ({ title, value }) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-5 shadow-lg 
                 transition transform hover:-translate-y-1 hover:shadow-xl"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-[#A435F0] mt-2">
        {value}
      </h2>
    </div>
  );
};

export default SystemOverviewPage;