import { useEffect, useState } from "react";
import axios from "axios";

const ManageClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    course: "",
    startDate: "",
    endDate: ""
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [classRes, courseRes] = await Promise.all([
        axios.get("/api/classes", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/courses", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setClasses(classRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/classes", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: "", course: "", startDate: "", endDate: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa lớp này?")) return;
    try {
      await axios.delete(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Delete lỗi");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-[#f7f9fa] min-h-screen px-6 py-8">
      
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-2xl font-bold mb-6">
          Quản lý lớp học
        </h1>

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Tạo lớp học mới
          </h2>

          <form
            onSubmit={handleCreate}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Tên lớp"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="border p-2 rounded-md"
              required
            />

            <select
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
              className="border p-2 rounded-md"
              required
            >
              <option value="">Chọn course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              className="border p-2 rounded-md"
              required
            />

            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              className="border p-2 rounded-md"
              required
            />

            <button
              type="submit"
              className="col-span-full bg-[#A435F0] text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Tạo lớp
            </button>
          </form>
        </div>

        {/* CLASS LIST */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Tên lớp</th>
                <th className="text-left p-3">Course</th>
                <th className="text-left p-3">Học viên</th>
                <th className="text-left p-3">Thời gian</th>
                <th className="text-right p-3">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr
                  key={cls._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {cls.title}
                  </td>

                  <td className="p-3">
                    {cls.course?.title}
                  </td>

                  <td className="p-3">
                    {cls.students?.length || 0}
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(cls.startDate).toLocaleDateString()} -{" "}
                    {new Date(cls.endDate).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    
                    <button
                      className="px-3 py-1 border rounded-md hover:bg-gray-100"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="px-3 py-1 border rounded-md text-red-500 hover:bg-red-50"
                    >
                      Xóa
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default ManageClassPage;