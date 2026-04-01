import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ManageTestPage.css";

const ManageTestPage = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tests/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/tests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTests(tests.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [courseId]);

  return (
    <div className="test-page">
      <div className="container">

        <div className="header">
          <h1>Manage Tests</h1>
          <button className="btn-add">+ Create Test</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tests.length === 0 ? (
          <p>No tests yet</p>
        ) : (
          <div className="test-list">
            {tests.map((test, index) => (
              <div className="test-card" key={test._id}>

                <div className="left">
                  <span className="index">{index + 1}</span>

                  <div>
                    <h3>{test.title}</h3>

                    <div className="meta">
                      <span>Questions: {test.questions?.length || 0}</span>
                      <span>Marks: {test.totalMarks}</span>
                    </div>

                    <span className="due">
                      Due: {test.dueDate ? new Date(test.dueDate).toLocaleDateString() : "No deadline"}
                    </span>
                  </div>
                </div>

                <div className="right">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-view">Submissions</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(test._id)}
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

export default ManageTestPage;