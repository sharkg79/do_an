import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ManageAssignmentPage.css";

const ManageAssignmentPage = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignments/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssignments(assignments.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  return (
    <div className="assignment-page">
      <div className="container">

        <div className="header">
          <h1>Manage Assignments</h1>
          <button className="btn-add">+ Add Assignment</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : assignments.length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          <div className="assignment-list">
            {assignments.map((a, index) => (
              <div className="assignment-card" key={a._id}>

                <div className="left">
                  <span className="index">{index + 1}</span>

                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>

                    <span className="due">
                      Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No deadline"}
                    </span>
                  </div>
                </div>

                <div className="right">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-view">Submissions</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(a._id)}
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

export default ManageAssignmentPage;