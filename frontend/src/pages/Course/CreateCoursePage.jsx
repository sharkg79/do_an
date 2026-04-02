import React, { useState } from "react";
import axios from "axios";
import "./CreateCoursePage.css";
import Navbar from "../../components/Navbar";

const CreateCoursePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "beginner",
    level: "Beginner",
    price: 0,
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/courses",
        {
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("✅ Course created successfully!");
      setForm({
        title: "",
        description: "",
        category: "beginner",
        level: "Beginner",
        price: 0,
        image: ""
      });

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <box>
  <Navbar />
    <div className="create-course-page">
      <div className="container">
        <h1 className="title">Create New Course</h1>

        <form className="card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your course..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="ielts">IELTS</option>
              <option value="toeic">TOEIC</option>
              <option value="business">Business</option>
              <option value="beginner">Beginner</option>
              <option value="speaking">Speaking</option>
              <option value="writing">Writing</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              
            </select>
          </div>

          <div className="form-group">
            <label>Level</label>
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Enter image URL (optional)"
            />
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
    </box>
  );
};

export default CreateCoursePage;