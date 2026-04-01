import React, { useState } from "react";
import axios from "axios";
import "./CreateCoursePage.css";

const CreateCoursePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    categories: "",
    price: ""
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
          categories: form.categories.split(",").map((c) => c.trim())
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
        categories: "",
        price: ""
      });

    } catch (err) {
      setMessage("❌ Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <label>Categories</label>
            <input
              type="text"
              name="categories"
              value={form.categories}
              onChange={handleChange}
              placeholder="e.g. Programming, Web, AI"
            />
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

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>

      </div>
    </div>
  );
};

export default CreateCoursePage;