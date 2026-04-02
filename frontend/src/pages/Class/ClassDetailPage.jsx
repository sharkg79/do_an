import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClassDetailPage = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH CLASS =================
  const fetchClass = async () => {
  try {
    const res = await axios.get(`/api/classes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("SUCCESS:", res.data);
    setClassData(res.data.class);

  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MSG:", err.message);

    setClassData(null);
  } finally {
    setLoading(false);
  }
};

  
  useEffect(() => {
    fetchClass();
  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // ================= NULL =================
  if (!classData) {
    return <div className="text-center py-10">Class not found</div>;
  }

  // ================= SAFE DATA =================
  const isEnrolled = classData.students?.some(
    (s) => s._id === user?._id
  );

  return (
    <div className="bg-[#f7f9fa] min-h-screen">
      {/* HEADER */}
      <div className="bg-[#1c1d1f] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">{classData.title}</h1>
          <p className="mt-3 text-gray-300">
            Course: {classData.course?.title || "N/A"}
          </p>
          <p className="mt-1 text-gray-400 text-sm">
            Instructor: {classData.instructor?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ABOUT */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">
              Thông tin lớp học
            </h2>
            <p className="text-gray-600">
              Đây là lớp học thuộc course <b>{classData.course?.title || "N/A"}</b>.
              Bạn sẽ học các nội dung liên quan và làm bài tập trong khóa học này.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Bắt đầu:{" "}
                {classData.startDate
                  ? new Date(classData.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Kết thúc:{" "}
                {classData.endDate
                  ? new Date(classData.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* STUDENTS */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">
              Học viên ({classData.students?.length || 0})
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {classData.students?.map((student) => (
                <div
                  key={student._id}
                  className="border rounded-md p-3 text-sm"
                >
                  {student.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-lg border sticky top-6">

            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>📚 Course: {classData.course?.title || "N/A"}</p>
              <p>👨‍🏫 Instructor: {classData.instructor?.name || "N/A"}</p>
              <p>👥 {classData.students?.length || 0} học viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;