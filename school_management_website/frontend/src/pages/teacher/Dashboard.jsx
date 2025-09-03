import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Profile from "./Profile";
import Students from "./Students";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarTab, setSidebarTab] = useState("dashboard");
  const [profileExists, setProfileExists] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/teacher/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.data.exists) {
          navigate("/teacher/onboarding");
        } else {
          setProfileExists(true);
        }
      })
      .catch(() => {
        navigate("/teacher/onboarding");
      });
  }, [navigate]);

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-house" },
    { key: "profile", label: "Profile", icon: "bi-person" },
    { key: "students", label: "Students", icon: "bi-people" }
  ];

  const renderContent = () => {
    switch (sidebarTab) {
      case "profile": return <Profile />;
      case "students": return <Students />;
      case "dashboard":
      default:
        return <div><h3>Welcome to Teacher Dashboard</h3><p>Add dashboard widgets here.</p></div>;
    }
  };

  if (profileExists === null) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f7fafd" }}>
      {/* Sidebar and Main Layout unchanged */}
      <div
        style={{
          minWidth: 220,
          background: "#212b36",
          color: "#fff",
          paddingTop: 24,
          borderRight: "1px solid #e3e7ed"
        }}
        className="flex-shrink-0 d-flex flex-column"
      >
        <div className="ps-4 pb-3 fs-4 fw-bold">
          <i className="bi bi-grid-3x3-gap me-2"></i>Teacher Panel
        </div>
        <div className="nav flex-column">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`btn btn-link px-4 py-3 text-start w-100 text-${sidebarTab === item.key ? "info" : "light"} fs-6 fw-semibold`}
              style={{
                ...(sidebarTab === item.key && {
                  background: "#2a3b4d",
                  borderLeft: "4px solid #0dcaf0"
                }),
                border: "none",
                borderRadius: 0
              }}
              onClick={() => setSidebarTab(item.key)}
            >
              <i className={`bi me-2 ${item.icon}`}></i>{item.label}
            </button>
          ))}
          <button
            className="btn btn-link px-4 py-3 text-start w-100 text-danger fs-6 fw-semibold mt-3"
            style={{ border: "none", borderRadius: 0 }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
        <div className="mt-auto ps-4 pb-4 text-muted small">
          © {new Date().getFullYear()} School Teacher
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-fill" style={{ padding: "2.5rem 2rem" }}>
        {renderContent()}
      </main>
    </div>
  );
}
