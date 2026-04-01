import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [summaryRes, progressRes] = await Promise.all([
        axios.get("/api/reports/summary", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/reports/course-progress", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(summaryRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] p-8">
      
      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Users", value: summary.totalUsers },
          { label: "Students", value: summary.totalStudents },
          { label: "Instructors", value: summary.totalInstructors },
          { label: "Courses", value: summary.totalCourses },
          { label: "Classes", value: summary.totalClasses },
          { label: "Lessons", value: summary.totalLessons },
          { label: "Assignments", value: summary.totalAssignments }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <p className="text-gray-500 text-sm mb-1">{item.label}</p>
            <h2 className="text-2xl font-bold text-[#A435F0]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== COURSE PROGRESS ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Course Progress
        </h2>

        {progress.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <div className="space-y-6">
            {progress.map((course) => (
              <div
                key={course.courseId}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-6"
              >
                {/* Course title */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.courseTitle}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {course.totalStudents} students
                  </span>
                </div>

                {/* Students progress */}
                <div className="space-y-3">
                  {course.studentProgress.slice(0, 5).map((student, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          Student {idx + 1}
                        </span>
                        <span className="font-medium text-gray-700">
                          {student.progressPercentage}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#A435F0] transition-all"
                          style={{
                            width: `${student.progressPercentage}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View more button */}
                <button className="mt-4 px-4 py-2 bg-[#A435F0] text-white rounded-md hover:bg-[#8710d8] transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;