import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageCoursePage.css";

const ManageCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="manage-page">
      <div className="container">
        
        <div className="header">
          <h1>Manage Courses</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <div className="grid">
            {courses.map((course) => (
              <div className="card" key={course._id}>
                
                <h2>{course.title}</h2>
                <p className="desc">{course.description}</p>

                <div className="meta">
                  <span>${course.price || 0}</span>
                </div>

                <div className="actions">
                  <button className="btn-edit">Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoursePage;