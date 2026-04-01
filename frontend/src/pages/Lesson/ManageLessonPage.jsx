import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ManageLessonPage.css";

const ManageLessonPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchLessons = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/lessons/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLessons(res.data.lessons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLessons(lessons.filter((l) => l._id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  return (
    <div className="lesson-page">
      <div className="container">

        <div className="header">
          <h1>Manage Lessons</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : lessons.length === 0 ? (
          <p>No lessons yet</p>
        ) : (
          <div className="lesson-list">
            {lessons.map((lesson, index) => (
              <div className="lesson-card" key={lesson._id}>
                
                <div className="left">
                  <span className="index">{index + 1}</span>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                  </div>
                </div>

                <div className="right">
                  <button className="btn-edit">Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(lesson._id)}
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

export default ManageLessonPage;