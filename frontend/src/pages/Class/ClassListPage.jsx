import { useEffect, useState } from "react";
import axios from "axios";

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/classes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (id) => {
    try {
      await axios.post(
        `/api/classes/${id}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Enroll thành công!");
      fetchClasses(); // reload
    } catch (err) {
      alert(err.response?.data?.message || "Enroll lỗi");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-[#f7f9fa] min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách lớp học</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gray-200 rounded-t-lg"></div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-lg line-clamp-2">
                {cls.title}
              </h2>

              <p className="text-sm text-gray-500">
                Course: {cls.course?.title}
              </p>

              <p className="text-sm text-gray-500">
                Instructor: {cls.instructor?.name}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(cls.startDate).toLocaleDateString()} -{" "}
                {new Date(cls.endDate).toLocaleDateString()}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => handleEnroll(cls._id)}
                className="mt-3 bg-[#A435F0] text-white py-2 rounded-md hover:bg-purple-700 transition"
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassListPage;