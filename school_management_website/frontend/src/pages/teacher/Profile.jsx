import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
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
  const [success, setSuccess] = useState("");

  // Load profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("/api/teacher/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.exists) {
          // Assuming profile is single object, not array
          const data = res.data.profile[0] || res.data.profile;
          setProfile(data);
          setForm({
            full_name: data.full_name || "",
            phone: data.phone || "",
            email: data.email || "",
            qualification: data.qualification || "",
            designation: data.designation || "",
            subject: data.subject || "",
            unit_id: data.unit_id || ""
          });
        } else {
          // No profile - redirect to onboarding
          navigate("/teacher/onboarding");
        }
      })
      .catch(() => {
        setError("Failed to load profile. Please login again.");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateEmail(email) {
    // Simple email regex validation
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple validation
    if (
      !form.full_name ||
      !form.phone ||
      !form.email ||
      !form.qualification ||
      !form.designation ||
      !form.unit_id
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/teacher/${profile.staff_id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    }
  }

  if (loading) return <div className="text-center mt-4">Loading profile...</div>;

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Teacher Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="full_name"
            className="form-control"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Qualification</label>
          <input
            type="text"
            name="qualification"
            className="form-control"
            value={form.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Designation</label>
          <input
            type="text"
            name="designation"
            className="form-control"
            value={form.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Subject (for teaching staff)</label>
          <input
            type="text"
            name="subject"
            className="form-control"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">School/Unit ID</label>
          <input
            type="text"
            name="unit_id"
            className="form-control"
            value={form.unit_id}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
