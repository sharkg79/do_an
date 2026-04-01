import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [summaryRes, progressRes, instructorRes] = await Promise.all([
        axios.get("/api/reports/summary", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/reports/course-progress", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/reports/instructor-dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(summaryRes.data);
      setProgress(progressRes.data);
      setInstructor(instructorRes.data);
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
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      {/* ===== SUMMARY ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card label="Courses" value={instructor?.totalCourses} />
        <Card label="Students" value={instructor?.totalStudents} />
        <Card label="Revenue" value={instructor?.totalRevenue + " VND"} />
        <Card label="Assignments" value={summary.totalAssignments} />
      </div>

      {/* ===== COURSE STATS ===== */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Course Performance</h2>

        <div className="space-y-4">
          {instructor?.courseStats.map(course => (
            <div key={course.courseId} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{course.courseTitle}</h3>
                <span>{course.students} students</span>
              </div>

              <p className="text-sm text-gray-500">
                Revenue: {course.revenue} VND
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PROGRESS ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Course Progress</h2>

        {progress.map(course => (
          <div key={course.courseId} className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-semibold mb-2">{course.courseTitle}</h3>

            {course.studentProgress.slice(0, 3).map((s, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>Student {i + 1}</span>
                  <span>{s.progressPercentage}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-purple-500 h-2 rounded"
                    style={{ width: `${s.progressPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white p-6 rounded shadow text-center">
    <p className="text-gray-500">{label}</p>
    <h2 className="text-2xl font-bold text-purple-600">{value}</h2>
  </div>
);

export default DashboardPage;