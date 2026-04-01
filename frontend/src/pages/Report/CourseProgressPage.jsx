import { useEffect, useState } from "react";
import axios from "axios";

const CourseProgressPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/reports/course-progress", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCourses(res.data);
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
        Loading course progress...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] p-8">
      
      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Course Progress
      </h1>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A435F0]"
      />

      {/* ===== COURSE LIST ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {courses
          .filter(c =>
            c.courseTitle.toLowerCase().includes(search.toLowerCase())
          )
          .map(course => (
            <div
              key={course.courseId}
              onClick={() => setSelectedCourse(course)}
              className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {course.courseTitle}
              </h2>

              <p className="text-gray-500 text-sm">
                {course.totalStudents} students
              </p>

              <button className="mt-4 w-full py-2 bg-[#A435F0] text-white rounded-md hover:bg-[#8710d8] transition">
                View Details
              </button>
            </div>
          ))}
      </div>

      {/* ===== COURSE DETAIL ===== */}
      {selectedCourse && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCourse.courseTitle}
            </h2>

            <button
              onClick={() => setSelectedCourse(null)}
              className="text-sm px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-gray-600 text-sm">Student</th>
                  <th className="py-2 text-gray-600 text-sm">Completed</th>
                  <th className="py-2 text-gray-600 text-sm">Total</th>
                  <th className="py-2 text-gray-600 text-sm">Progress</th>
                </tr>
              </thead>

              <tbody>
                {selectedCourse.studentProgress.map((student, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    
                    <td className="py-3 text-gray-700">
                      Student {idx + 1}
                    </td>

                    <td className="py-3 text-gray-600">
                      {student.completedAssignments}
                    </td>

                    <td className="py-3 text-gray-600">
                      {student.totalAssignments}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#A435F0]"
                            style={{
                              width: `${student.progressPercentage}%`
                            }}
                          ></div>
                        </div>

                        <span className="text-sm text-gray-700 w-12">
                          {student.progressPercentage}%
                        </span>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgressPage;