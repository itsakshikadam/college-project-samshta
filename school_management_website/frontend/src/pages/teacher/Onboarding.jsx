import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherOnboarding() {
  const [staffType, setStaffType] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    qualification: "",
    designation: "",
    subject: "",
    unit_id: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get JWT token from local storage
  const token = localStorage.getItem("token");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleStaffTypeSelect(e) {
    setStaffType(e.target.value);
    if (e.target.value !== "teaching") {
      setForm(f => ({ ...f, subject: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // reset error

    // Basic validation
    if (!staffType) return setError("Staff type is required.");
    if (!form.full_name || !form.unit_id || !form.phone || !form.email || !form.qualification || !form.designation) {
      return setError("All fields (except subject for non-teaching) are required.");
    }
    if (staffType === "teaching" && !form.subject) {
      return setError("Subject is required for teaching staff.");
    }

    try {
      await axios.post(
        "/api/teacher",
        {
          ...form,
          staff_type: staffType
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // navigate to dashboard after successful onboarding
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Teacher Onboarding</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Staff Type:</label>
          <select className="form-select" value={staffType} onChange={handleStaffTypeSelect} required>
            <option value="">Select...</option>
            <option value="teaching">Teaching</option>
            <option value="non-teaching">Non-Teaching</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Full Name:</label>
          <input className="form-control" name="full_name" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Qualification:</label>
          <input className="form-control" name="qualification" value={form.qualification} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Designation:</label>
          <input className="form-control" name="designation" value={form.designation} onChange={handleChange} required />
        </div>
        {staffType === "teaching" && (
          <div className="mb-3">
            <label className="form-label">Subject:</label>
            <input className="form-control" name="subject" value={form.subject} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">School/Unit ID:</label>
          <input className="form-control" name="unit_id" value={form.unit_id} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
