import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/teacher/students", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setStudents(res.data);
        setFiltered(res.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load students.");
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSearchChange(e) {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(students.filter(s =>
      s.full_name.toLowerCase().includes(val) ||
      s.roll_number.toString().includes(val) ||
      s.standard.toLowerCase().includes(val) ||
      s.division.toLowerCase().includes(val)
    ));
  }

  if (loading) return <div className="mt-3 text-center">Loading students...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h2 className="mb-4">Student Management</h2>
      <input
        className="form-control mb-3"
        placeholder="Search by name, roll no, standard, or division"
        value={search}
        onChange={handleSearchChange}
      />
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Roll No</th>
              <th>Full Name</th>
              <th>Standard</th>
              <th>Division</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Parent Name</th>
              <th>Parent Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(student => (
              <tr key={student.student_id}>
                <td>{student.roll_number}</td>
                <td>{student.full_name}</td>
                <td>{student.standard}</td>
                <td>{student.division}</td>
                <td>{student.dob}</td>
                <td>{student.gender}</td>
                <td>{student.parent_name}</td>
                <td>{student.parent_phone}</td>
                <td>{student.address}</td>
                <td>
                  <button className="btn btn-sm btn-primary" disabled>Edit</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="10" className="text-center">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
